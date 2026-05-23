import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { SESSION_COOKIE } from "@/lib/constants";
import { SessionUser } from "@/lib/types";
import { getSessionSecret, readSessionSecret } from "@/lib/server/auth-config";

type SessionPayload = SessionUser & {
  exp: number;
};

export function hasSessionSecret() {
  return Boolean(readSessionSecret());
}

export function matchesSmokeSecret(candidate?: string | null) {
  const configuredSecret = readSessionSecret();
  if (!candidate || !configuredSecret) {
    return false;
  }

  return candidate === configuredSecret;
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export async function createSessionToken(user: SessionUser) {
  const payload: SessionPayload = {
    ...user,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
  const encoded = toBase64Url(JSON.stringify(payload));
  const signature = await sign(encoded);
  return `${encoded}.${signature}`;
}

export async function verifySessionToken(token?: string | null) {
  if (!token) return null;
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    const expected = sign(encoded);
    if (!timingSafeEqual(Buffer.from(expected, "base64url"), Buffer.from(signature, "base64url"))) {
      return null;
    }
    const payload = JSON.parse(fromBase64Url(encoded)) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId, email: payload.email, fullName: payload.fullName } satisfies SessionUser;
  } catch (error) {
    console.warn("Unable to verify the current session token.", error);
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
