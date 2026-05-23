import { createHash, createHmac, pbkdf2Sync, randomBytes } from "node:crypto";
import { pbkdf2 as noblePbkdf2 } from "@noble/hashes/pbkdf2.js";
import { sha256 as nobleSha256 } from "@noble/hashes/sha2.js";
import { getPasswordPepper, readSessionSecret } from "@/lib/server/auth-config";

const PASSWORD_ITERATIONS = 100000;
const DERIVED_KEY_BYTES = 32;
const FAST_VERIFIER_ALGORITHM = "hmac-sha256";
const PASSWORD_VERIFIER_SUFFIX = ":password-verifier";

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string) {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string.");
  }

  const output = new Uint8Array(hex.length / 2);
  for (let index = 0; index < hex.length; index += 2) {
    output[index / 2] = Number.parseInt(hex.slice(index, index + 2), 16);
  }
  return output;
}

function randomHex(size = 32) {
  return randomBytes(size).toString("hex");
}

async function hashSha256Hex(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function derivePasswordHash(password: string, salt: string, iterations: number) {
  if (iterations > PASSWORD_ITERATIONS) {
    return noblePbkdf2(nobleSha256, password, salt, { c: iterations, dkLen: DERIVED_KEY_BYTES });
  }

  try {
    return new Uint8Array(pbkdf2Sync(password, salt, iterations, DERIVED_KEY_BYTES, "sha256"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/iteration counts above \d+ are not supported/i.test(message)) {
      return noblePbkdf2(nobleSha256, password, salt, { c: iterations, dkLen: DERIVED_KEY_BYTES });
    }

    throw error;
  }
}

function getVerifierKey(secret: string) {
  return `${secret}${PASSWORD_VERIFIER_SUFFIX}`;
}

function createFastPasswordVerifier(password: string, secret: string) {
  return createHmac("sha256", getVerifierKey(secret)).update(password).digest("hex");
}

function createPepperFastPasswordVerifier(password: string) {
  return createFastPasswordVerifier(password, getPasswordPepper());
}

function createLegacySessionFastPasswordVerifier(password: string) {
  const legacySessionSecret = readSessionSecret();
  if (!legacySessionSecret) {
    return null;
  }
  return createFastPasswordVerifier(password, legacySessionSecret);
}

function splitPasswordHash(passwordHash: string) {
  const separator = passwordHash.indexOf("|");
  if (separator === -1) {
    return {
      pbkdf2Record: passwordHash,
      fastVerifierRecord: null,
    };
  }

  return {
    pbkdf2Record: passwordHash.slice(0, separator),
    fastVerifierRecord: passwordHash.slice(separator + 1),
  };
}

export function hasFastPasswordVerifier(passwordHash: string) {
  const { fastVerifierRecord } = splitPasswordHash(passwordHash);
  return Boolean(fastVerifierRecord?.startsWith(`${FAST_VERIFIER_ALGORITHM}$`));
}

function buildPasswordHashWithPepper(pbkdf2Record: string, password: string) {
  return `${pbkdf2Record}|${FAST_VERIFIER_ALGORITHM}$${createPepperFastPasswordVerifier(password)}`;
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left[index] ^ right[index];
  }
  return mismatch === 0;
}

export async function hashPassword(password: string) {
  const salt = randomHex(16);
  const derived = await derivePasswordHash(password, salt, PASSWORD_ITERATIONS);
  return buildPasswordHashWithPepper(`pbkdf2$${PASSWORD_ITERATIONS}$${salt}$${bytesToHex(derived)}`, password);
}

export type PasswordVerificationResult = {
  matches: boolean;
  nextPasswordHash?: string;
};

export async function verifyPassword(password: string, passwordHash: string) {
  const { pbkdf2Record, fastVerifierRecord } = splitPasswordHash(passwordHash);
  let shouldRefreshFastVerifier = !fastVerifierRecord;

  if (fastVerifierRecord) {
    const [algorithm, expectedFastVerifier] = fastVerifierRecord.split("$");
    if (algorithm === FAST_VERIFIER_ALGORITHM && expectedFastVerifier) {
      if (
        constantTimeEqual(hexToBytes(createPepperFastPasswordVerifier(password)), hexToBytes(expectedFastVerifier))
      ) {
        return { matches: true };
      }

      const legacyFastVerifier = createLegacySessionFastPasswordVerifier(password);
      if (
        legacyFastVerifier &&
        constantTimeEqual(hexToBytes(legacyFastVerifier), hexToBytes(expectedFastVerifier))
      ) {
        shouldRefreshFastVerifier = true;
      }
    }
  }

  const [algorithm, rawIterations, salt, expected] = pbkdf2Record.split("$");
  if (algorithm !== "pbkdf2" || !rawIterations || !salt || !expected) {
    return { matches: false };
  }

  const iterations = Number.parseInt(rawIterations, 10);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return { matches: false };
  }

  const derived = await derivePasswordHash(password, salt, iterations);
  const expectedBytes = hexToBytes(expected);
  if (expectedBytes.length !== derived.length) {
    return { matches: false };
  }

  if (!constantTimeEqual(derived, expectedBytes)) {
    return { matches: false };
  }

  return shouldRefreshFastVerifier
    ? { matches: true, nextPasswordHash: buildPasswordHashWithPepper(pbkdf2Record, password) }
    : { matches: true };
}

export function createOpaqueToken() {
  return randomHex(24);
}

export function hashVerificationToken(token: string) {
  return hashSha256Hex(token);
}
