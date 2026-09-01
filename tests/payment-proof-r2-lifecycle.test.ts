import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import {
  assertDepositProofMutationAllowed,
  CustomerPaymentProofError,
  validatePaymentProofInput,
} from "../src/lib/server/payment-proof-service";

const root = process.cwd();

function input(type: string, bytes: number[], size = bytes.length) {
  return {
    fileName: "proof.bin",
    fileType: type,
    fileSize: size,
    proofData: `data:${type};base64,${Buffer.from(bytes).toString("base64")}`,
  };
}

function code(error: unknown) {
  return error instanceof CustomerPaymentProofError ? error.code : null;
}

describe("C6 customer payment proof lifecycle", () => {
  it("accepts valid JPEG, PNG, WEBP, and PDF signatures", async () => {
    const cases = [
      input("image/jpeg", [0xff, 0xd8, 0xff, 0x00]),
      input("image/png", [137, 80, 78, 71, 13, 10, 26, 10]),
      input("image/webp", [...Buffer.from("RIFF"), 0, 0, 0, 0, ...Buffer.from("WEBP")]),
      input("application/pdf", [...Buffer.from("%PDF-1.7")]),
    ];
    for (const proof of cases) {
      const result = await validatePaymentProofInput(proof);
      assert.equal(result.contentType, proof.fileType);
      assert.equal(result.sha256Hex.length, 64);
    }
  });

  it("rejects HTML, SVG, MIME spoofing, and oversize payloads", async () => {
    await assert.rejects(() => validatePaymentProofInput(input("image/png", [...Buffer.from("<html>spoof</html>")])), (error) => code(error) === "payment_proof_signature_invalid");
    await assert.rejects(() => validatePaymentProofInput(input("image/png", [...Buffer.from("<svg></svg>")])), (error) => code(error) === "payment_proof_signature_invalid");
    await assert.rejects(() => validatePaymentProofInput(input("image/png", [0xff, 0xd8, 0xff])), (error) => code(error) === "payment_proof_mime_mismatch");
    await assert.rejects(() => validatePaymentProofInput(input("image/png", [137, 80, 78, 71, 13, 10, 26, 10], 1024 * 1024 + 1)), (error) => code(error) === "payment_proof_size_invalid");
  });

  it("blocks wrong user/missing transaction, wrong kind, review, and terminal states", () => {
    assert.throws(() => assertDepositProofMutationAllowed(null), (error) => code(error) === "payment_proof_transaction_not_found");
    assert.throws(() => assertDepositProofMutationAllowed({ id: "t", user_id: "u", kind: "withdrawal", status: "pending", review_status: null }), (error) => code(error) === "payment_proof_wrong_transaction_kind");
    assert.throws(() => assertDepositProofMutationAllowed({ id: "t", user_id: "u", kind: "deposit", status: "pending", review_status: "under_review" }), (error) => code(error) === "deposit_under_review");
    for (const row of [
      { id: "t", user_id: "u", kind: "deposit", status: "completed", review_status: null },
      { id: "t", user_id: "u", kind: "deposit", status: "pending", review_status: "approved" },
      { id: "t", user_id: "u", kind: "deposit", status: "pending", review_status: "rejected" },
    ]) assert.throws(() => assertDepositProofMutationAllowed(row), (error) => code(error) === "deposit_terminal");
  });

  it("enforces one row for 10 concurrent same-key claims and supports safe replacement", () => {
    const temp = mkdtempSync(join(tmpdir(), "sgt-customer-c6f-"));
    const database = join(temp, "c6f.sqlite");
    const admin = join(root, "..", "speedglobaltrade-admin");
    const script = String.raw`
import concurrent.futures,json,sqlite3,sys
p,*fs=sys.argv[1:]
d=sqlite3.connect(p);d.execute('PRAGMA foreign_keys=ON')
for f in fs:d.executescript(open(f,encoding='utf8').read())
n='2026-09-01T00:00:00Z'
d.execute("INSERT INTO users (id,email,password_hash,full_name,country,locale,tier,two_factor_enabled,cash_balance,created_at,updated_at) VALUES ('u','u@x','h','U','NG','en','Signature',0,0,?,?)",(n,n))
d.execute("INSERT INTO transactions (id,user_id,kind,label,amount,status,note,method,created_at) VALUES ('t','u','deposit','D',100,'pending','n','Wire',?)",(n,))
d.execute("INSERT INTO deposit_cases (transaction_id,user_id,review_status,created_at,updated_at,version) VALUES ('t','u','awaiting_review',?,?,0)",(n,n));d.commit();d.close()
def claim(i,key):
 x=sqlite3.connect(p,timeout=3,isolation_level=None);x.execute('PRAGMA busy_timeout=3000')
 try:
  x.execute("INSERT INTO payment_proof_files (id,transaction_id,user_id,source_type,storage_state,object_key,content_type,size_bytes,sha256_hex,idempotency_key_hash,created_at) VALUES (?,?,?,'customer_upload','pending_upload',?,'image/png',8,?,?,?)",('p'+str(i),'t','u','proofs/v1/p'+str(i),'a'*64,key,n));return 1
 except sqlite3.Error:return 0
 finally:x.close()
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as q:wins=sum(q.map(lambda i:claim(i,'same-key'),range(10)))
x=sqlite3.connect(p);first=x.execute("SELECT id FROM payment_proof_files WHERE idempotency_key_hash='same-key'").fetchone()[0]
x.execute("UPDATE payment_proof_files SET storage_state='active',verified_at=? WHERE id=?",(n,first));x.commit()
claim(99,'replacement-key')
x.execute("UPDATE payment_proof_files SET storage_state='superseded',superseded_at=? WHERE transaction_id='t' AND storage_state='active'",(n,))
x.execute("UPDATE payment_proof_files SET storage_state='active',verified_at=? WHERE id='p99'",(n,));x.commit()
states=dict(x.execute("SELECT storage_state,COUNT(*) FROM payment_proof_files GROUP BY storage_state"))
print(json.dumps({'wins':wins,'rows':sum(states.values()),'states':states}))
`;
    try {
      const run = spawnSync("python", ["-c", script, database,
        join(root, "migrations/0001_initial.sql"),
        join(root, "migrations/0003_deposit_proofs.sql"),
        join(admin, "migrations/0005_admin_control_plane.sql"),
        join(admin, "migrations/0006_admin_security_hardening.sql"),
        join(admin, "migrations/0007_deposit_review_and_settlement.sql"),
        join(root, "migrations/0011_private_payment_proofs_r2.sql"),
        join(root, "migrations/0012_canonical_payment_proof_settlement.sql"),
      ], { encoding: "utf8" });
      assert.equal(run.status, 0, run.stderr);
      assert.deepEqual(JSON.parse(run.stdout), { wins: 1, rows: 2, states: { active: 1, superseded: 1 } });
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  });

  it("keeps r2_primary bodies out of legacy D1 and preserves resumable objects", () => {
    const source = readFileSync(join(root, "src/lib/server/payment-proof-service.ts"), "utf8");
    const r2Branch = source.slice(source.indexOf('if (mode === "legacy")') + 1);
    assert.doesNotMatch(r2Branch, /INSERT INTO deposit_proofs|proof_data/);
    assert.doesNotMatch(r2Branch, /bucket\.delete/);
    assert.match(r2Branch, /storage_state = 'superseded'/);
    assert.match(r2Branch, /deposit_under_review|review_status/);
    assert.match(r2Branch, /idempotency_key_hash/);
  });
});
