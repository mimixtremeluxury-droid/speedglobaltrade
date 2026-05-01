import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/session";
import { SESSION_COOKIE } from "@/lib/constants";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; fullName?: string };
  if (!body.email || !body.fullName) {
    return NextResponse.json({ error: "Missing login payload." }, { status: 400 });
  }

  const token = await createSessionToken({
    email: body.email,
    fullName: body.fullName,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
