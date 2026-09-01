import { getCloudflareContext } from "@/lib/server/cloudflare";
import { getDb, queryFirst } from "@/lib/server/db";

export const MAX_PAYMENT_PROOF_BYTES = 1024 * 1024;
export const SUPPORTED_PAYMENT_PROOF_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;
export type PaymentProofContentType = typeof SUPPORTED_PAYMENT_PROOF_TYPES[number];
export type PaymentProofStorageMode = "legacy" | "r2_primary";

export type PaymentProofInput = {
  fileName: string;
  fileType: string;
  fileSize: number;
  proofData: string;
};

export type DepositState = {
  id: string;
  user_id: string;
  kind: string;
  status: string;
  review_status: string | null;
};

export function assertDepositProofMutationAllowed(row: DepositState | null) {
  if (!row) return fail("payment_proof_transaction_not_found", 404, "Pending deposit transaction not found.");
  if (row.kind !== "deposit") return fail("payment_proof_wrong_transaction_kind", 409, "Payment proof can only be attached to a deposit.");
  if (row.status !== "pending" || row.review_status === "approved" || row.review_status === "rejected") {
    return fail("deposit_terminal", 409, "Proof changes are blocked for a terminal deposit.");
  }
  if (row.review_status === "under_review") {
    return fail("deposit_under_review", 409, "Proof changes are blocked while this deposit is under review.");
  }
  return row;
}

type ProofMapping = {
  id: string;
  transaction_id: string;
  user_id: string;
  storage_state: string;
  object_key: string | null;
  content_type: string | null;
  size_bytes: number | null;
  sha256_hex: string | null;
};

export class CustomerPaymentProofError extends Error {
  constructor(readonly code: string, readonly status: number, message: string) {
    super(message);
    this.name = "CustomerPaymentProofError";
  }
}

function fail(code: string, status: number, message: string): never {
  throw new CustomerPaymentProofError(code, status, message);
}

export function requirePaymentProofIdempotencyKey(value: string | null | undefined) {
  if (!value || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    fail("payment_proof_idempotency_key_required", 400, "A valid payment proof idempotency key is required.");
  }
  return value.toLowerCase();
}

export function getPaymentProofStorageMode(value = process.env.SGT_PAYMENT_PROOF_STORAGE_MODE): PaymentProofStorageMode {
  if (!value || value === "legacy") return "legacy";
  if (value === "r2_primary") return "r2_primary";
  return fail("payment_proof_storage_mode_invalid", 500, "Payment proof storage mode is invalid.");
}

function detectContentType(bytes: Uint8Array): PaymentProofContentType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)) return "image/png";
  if (bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP") return "image/webp";
  if (bytes.length >= 5 && new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-") return "application/pdf";
  return null;
}

function extensionFor(contentType: PaymentProofContentType) {
  return contentType === "image/jpeg" ? "jpg" : contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "pdf";
}

export async function sha256Hex(bytes: Uint8Array) {
  const stable = Uint8Array.from(bytes);
  const digest = await crypto.subtle.digest("SHA-256", stable.buffer);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function validatePaymentProofInput(proof: PaymentProofInput) {
  if (proof.fileSize <= 0 || proof.fileSize > MAX_PAYMENT_PROOF_BYTES) {
    return fail("payment_proof_size_invalid", 400, "Payment proof must be 1MB or smaller.");
  }
  const match = /^data:([^;,]+);base64,([A-Za-z0-9+/=\r\n]+)$/.exec(proof.proofData);
  if (!match) return fail("payment_proof_decode_invalid", 400, "Payment proof encoding is invalid.");
  const bytes = Uint8Array.from(Buffer.from(match[2].replace(/[\r\n]/g, ""), "base64"));
  if (bytes.byteLength !== proof.fileSize) return fail("payment_proof_size_mismatch", 400, "Payment proof size does not match its content.");
  const contentType = detectContentType(bytes);
  if (!contentType) return fail("payment_proof_signature_invalid", 400, "Payment proof must be a valid JPG, PNG, WEBP, or PDF file.");
  if (match[1] !== proof.fileType || proof.fileType !== contentType) {
    return fail("payment_proof_mime_mismatch", 400, "Payment proof MIME does not match its binary signature.");
  }
  return { bytes, contentType, extension: extensionFor(contentType), sha256Hex: await sha256Hex(bytes) };
}

async function assertMutableDeposit(userId: string, transactionId: string, database: D1Database) {
  const row = await queryFirst<DepositState>(
    `SELECT t.id, t.user_id, t.kind, t.status, dc.review_status
     FROM transactions t LEFT JOIN deposit_cases dc ON dc.transaction_id = t.id
     WHERE t.id = ? AND t.user_id = ? LIMIT 1`,
    [transactionId, userId],
    database,
  );
  return assertDepositProofMutationAllowed(row);
}

async function writeLegacyProof(
  userId: string,
  transactionId: string,
  proof: PaymentProofInput,
  contentType: PaymentProofContentType,
  database: D1Database,
  now: string,
) {
  await database.batch([
    database.prepare(
      `INSERT INTO deposit_proofs (id, transaction_id, user_id, file_name, file_type, file_size, proof_data, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(transaction_id) DO UPDATE SET
         file_name = excluded.file_name, file_type = excluded.file_type,
         file_size = excluded.file_size, proof_data = excluded.proof_data,
         submitted_at = excluded.submitted_at`,
    ).bind(crypto.randomUUID(), transactionId, userId, proof.fileName, contentType, proof.fileSize, proof.proofData, now),
    database.prepare("UPDATE transactions SET note = ? WHERE id = ? AND user_id = ? AND kind = 'deposit' AND status = 'pending'")
      .bind("Payment proof uploaded. Operations review is pending; your balance remains unchanged until approval.", transactionId, userId),
  ]);
}

export async function submitCustomerPaymentProof(
  userId: string,
  transactionId: string,
  proof: PaymentProofInput,
  idempotencyKey: string,
  options: { database?: D1Database; bucket?: CloudflareEnv["PAYMENT_PROOFS"]; storageMode?: PaymentProofStorageMode; now?: string } = {},
) {
  const database = options.database ?? getDb();
  const key = requirePaymentProofIdempotencyKey(idempotencyKey);
  const validated = await validatePaymentProofInput(proof);
  const mode = options.storageMode ?? getPaymentProofStorageMode();
  const now = options.now ?? new Date().toISOString();
  const keyHash = mode === "r2_primary" ? await sha256Hex(new TextEncoder().encode(key)) : null;

  if (keyHash) {
    const previous = await queryFirst<ProofMapping>(
      `SELECT id, transaction_id, user_id, storage_state, object_key, content_type, size_bytes, sha256_hex
       FROM payment_proof_files WHERE user_id = ? AND idempotency_key_hash = ? LIMIT 1`,
      [userId, keyHash],
      database,
    );
    if (previous) {
      if (
        previous.transaction_id !== transactionId
        || previous.sha256_hex !== validated.sha256Hex
        || previous.size_bytes !== validated.bytes.byteLength
        || previous.content_type !== validated.contentType
      ) {
        return fail("payment_proof_idempotency_conflict", 409, "This idempotency key belongs to a different proof intent.");
      }
      if (previous.storage_state === "active" || previous.storage_state === "superseded") {
        return { proofId: previous.id, storageState: previous.storage_state, idempotent: true };
      }
    }
  }

  await assertMutableDeposit(userId, transactionId, database);

  if (mode === "legacy") {
    await writeLegacyProof(userId, transactionId, proof, validated.contentType, database, now);
    return { proofId: null, storageState: "legacy" as const, idempotent: false };
  }

  const bucket = options.bucket ?? getCloudflareContext().env.PAYMENT_PROOFS;
  if (!bucket) return fail("payment_proof_storage_unavailable", 503, "Payment proof storage is unavailable.");
  if (!keyHash) return fail("payment_proof_idempotency_key_required", 400, "A valid payment proof idempotency key is required.");
  const proposedId = crypto.randomUUID();
  const month = now.slice(0, 7).replace("-", "/");
  const proposedObjectKey = `proofs/v1/live/${month}/${proposedId}.${validated.extension}`;
  const safeName = proof.fileName.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 160) || `payment-proof.${validated.extension}`;

  await database.prepare(
    `INSERT OR IGNORE INTO payment_proof_files (
       id, transaction_id, user_id, source_type, storage_state, object_key,
       original_filename, content_type, size_bytes, sha256_hex,
       idempotency_key_hash, created_at
     ) VALUES (?, ?, ?, 'customer_upload', 'pending_upload', ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    proposedId, transactionId, userId, proposedObjectKey, safeName,
    validated.contentType, validated.bytes.byteLength, validated.sha256Hex, keyHash, now,
  ).run();

  const mapping = await queryFirst<ProofMapping>(
    `SELECT id, transaction_id, user_id, storage_state, object_key, content_type, size_bytes, sha256_hex
     FROM payment_proof_files WHERE user_id = ? AND idempotency_key_hash = ? LIMIT 1`,
    [userId, keyHash],
    database,
  );
  if (!mapping || !mapping.object_key) return fail("payment_proof_claim_failed", 409, "Payment proof upload could not be claimed.");
  if (mapping.transaction_id !== transactionId || mapping.sha256_hex !== validated.sha256Hex || mapping.size_bytes !== validated.bytes.byteLength || mapping.content_type !== validated.contentType) {
    return fail("payment_proof_idempotency_conflict", 409, "This idempotency key belongs to a different proof intent.");
  }
  if (mapping.storage_state === "superseded") {
    return { proofId: mapping.id, storageState: "superseded" as const, idempotent: true };
  }
  if (!["pending_upload", "r2_stored", "verified", "active"].includes(mapping.storage_state)) {
    return fail("payment_proof_state_conflict", 409, "Payment proof upload is not in a resumable state.");
  }

  let object = await bucket.head(mapping.object_key);
  if (object && (object.size !== validated.bytes.byteLength || object.customMetadata?.sha256 !== validated.sha256Hex)) {
    return fail("payment_proof_storage_integrity_conflict", 409, "Payment proof storage integrity conflict.");
  }
  if (!object) {
    await bucket.put(mapping.object_key, validated.bytes, {
      httpMetadata: { contentType: validated.contentType },
      customMetadata: { sha256: validated.sha256Hex, proofId: mapping.id },
    });
    object = await bucket.head(mapping.object_key);
  }
  if (!object || object.size !== validated.bytes.byteLength || object.customMetadata?.sha256 !== validated.sha256Hex) {
    return fail("payment_proof_storage_verification_failed", 503, "Payment proof storage verification failed.");
  }

  try {
    await database.batch([
      database.prepare(
        `UPDATE payment_proof_files SET storage_state = 'verified', uploaded_at = COALESCE(uploaded_at, ?),
           verified_at = ?, r2_etag = ?, r2_version = ?, failure_code = NULL
         WHERE id = ? AND storage_state IN ('pending_upload','r2_stored','verified')`,
      ).bind(now, now, object.etag, object.version, mapping.id),
      database.prepare(
        `UPDATE payment_proof_files SET storage_state = 'superseded', superseded_at = ?
         WHERE transaction_id = ? AND id <> ? AND storage_state = 'active'
           AND EXISTS (
             SELECT 1 FROM transactions t LEFT JOIN deposit_cases dc ON dc.transaction_id = t.id
             WHERE t.id = ? AND t.user_id = ? AND t.kind = 'deposit' AND t.status = 'pending'
               AND COALESCE(dc.review_status, 'awaiting_review') = 'awaiting_review'
           )`,
      ).bind(now, transactionId, mapping.id, transactionId, userId),
      database.prepare(
        `UPDATE payment_proof_files
         SET storage_state = CASE WHEN
           storage_state IN ('verified','active')
           AND object_key = ? AND sha256_hex = ? AND size_bytes = ? AND content_type = ?
           AND EXISTS (
             SELECT 1 FROM transactions t LEFT JOIN deposit_cases dc ON dc.transaction_id = t.id
             WHERE t.id = payment_proof_files.transaction_id
               AND t.user_id = payment_proof_files.user_id
               AND t.kind = 'deposit' AND t.status = 'pending'
               AND COALESCE(dc.review_status, 'awaiting_review') = 'awaiting_review'
           )
           AND NOT EXISTS (
             SELECT 1 FROM payment_proof_files other
             WHERE other.transaction_id = payment_proof_files.transaction_id
               AND other.id <> payment_proof_files.id AND other.storage_state = 'active'
           )
         THEN 'active' ELSE 'proof_activation_invariant_failed' END
         WHERE id = ?`,
      ).bind(mapping.object_key, validated.sha256Hex, validated.bytes.byteLength, validated.contentType, mapping.id),
      database.prepare(
        "UPDATE transactions SET note = ? WHERE id = ? AND user_id = ? AND kind = 'deposit' AND status = 'pending'",
      ).bind("Payment proof stored and verified. Operations review is pending; your balance remains unchanged until approval.", transactionId, userId),
    ]);
  } catch {
    const state = await queryFirst<{ storage_state: string }>("SELECT storage_state FROM payment_proof_files WHERE id = ?", [mapping.id], database);
    if (state?.storage_state === "active") return { proofId: mapping.id, storageState: "active" as const, idempotent: true };
    await assertMutableDeposit(userId, transactionId, database);
    return fail("payment_proof_activation_conflict", 409, "Payment proof activation conflicted with a review state change. The verified object remains resumable.");
  }

  const active = await queryFirst<{ id: string }>(
    "SELECT id FROM payment_proof_files WHERE id = ? AND transaction_id = ? AND user_id = ? AND storage_state = 'active'",
    [mapping.id, transactionId, userId],
    database,
  );
  if (!active) return fail("payment_proof_activation_failed", 500, "Payment proof did not reach its required active state.");
  return { proofId: mapping.id, storageState: "active" as const, idempotent: mapping.id !== proposedId };
}
