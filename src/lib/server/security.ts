const encoder = new TextEncoder();

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function randomHex(size = 32) {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(size)));
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return bytesToHex(new Uint8Array(digest));
}

export async function hashPassword(password: string) {
  const salt = randomHex(16);
  const iterations = 310000;
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: encoder.encode(salt),
      iterations,
    },
    keyMaterial,
    256,
  );
  return `pbkdf2$${iterations}$${salt}$${bytesToHex(new Uint8Array(derived))}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [algorithm, rawIterations, salt, expected] = passwordHash.split("$");
  if (algorithm !== "pbkdf2" || !rawIterations || !salt || !expected) {
    return false;
  }

  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: encoder.encode(salt),
      iterations: Number(rawIterations),
    },
    keyMaterial,
    256,
  );

  return bytesToHex(new Uint8Array(derived)) === expected;
}

export function createOpaqueToken() {
  return randomHex(24);
}

export function hashVerificationToken(token: string) {
  return sha256(token);
}
