import { createHash, createHmac, pbkdf2Sync, randomBytes } from "node:crypto";
import { getSessionSecret } from "@/lib/session";

const PASSWORD_ITERATIONS = 100000;
const DERIVED_KEY_BYTES = 32;
const FAST_VERIFIER_ALGORITHM = "hmac-sha256";

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

async function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function derivePasswordHash(password: string, salt: string, iterations: number) {
  return new Uint8Array(pbkdf2Sync(password, salt, iterations, DERIVED_KEY_BYTES, "sha256"));
}

function getFastVerifierSecret() {
  return `${getSessionSecret()}:password-verifier`;
}

function createFastPasswordVerifier(password: string) {
  return createHmac("sha256", getFastVerifierSecret()).update(password).digest("hex");
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

export function appendFastPasswordVerifier(passwordHash: string, password: string) {
  if (hasFastPasswordVerifier(passwordHash)) {
    return passwordHash;
  }

  return `${passwordHash}|${FAST_VERIFIER_ALGORITHM}$${createFastPasswordVerifier(password)}`;
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
  const fastVerifier = createFastPasswordVerifier(password);
  return `pbkdf2$${PASSWORD_ITERATIONS}$${salt}$${bytesToHex(derived)}|${FAST_VERIFIER_ALGORITHM}$${fastVerifier}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const { pbkdf2Record, fastVerifierRecord } = splitPasswordHash(passwordHash);

  if (fastVerifierRecord) {
    const [algorithm, expectedFastVerifier] = fastVerifierRecord.split("$");
    if (algorithm === FAST_VERIFIER_ALGORITHM && expectedFastVerifier) {
      return constantTimeEqual(hexToBytes(createFastPasswordVerifier(password)), hexToBytes(expectedFastVerifier));
    }
  }

  const [algorithm, rawIterations, salt, expected] = pbkdf2Record.split("$");
  if (algorithm !== "pbkdf2" || !rawIterations || !salt || !expected) {
    return false;
  }

  const iterations = Number.parseInt(rawIterations, 10);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return false;
  }

  const derived = await derivePasswordHash(password, salt, iterations);
  const expectedBytes = hexToBytes(expected);
  if (expectedBytes.length !== derived.length) {
    return false;
  }

  return constantTimeEqual(derived, expectedBytes);
}

export function createOpaqueToken() {
  return randomHex(24);
}

export function hashVerificationToken(token: string) {
  return sha256(token);
}
