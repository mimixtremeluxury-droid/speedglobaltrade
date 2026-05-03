import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";
import { verifyAuthToken } from "@/lib/server/auth-service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const locale = url.searchParams.get("locale");

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale ?? "en"}/login?notice=verification-invalid`, request.url));
  }

  const result = await verifyAuthToken(token, locale);
  if (!result.ok) {
    return NextResponse.redirect(new URL(result.redirectPath, request.url));
  }

  const response = NextResponse.redirect(new URL(result.redirectPath, request.url));
  response.cookies.set(SESSION_COOKIE, result.sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
