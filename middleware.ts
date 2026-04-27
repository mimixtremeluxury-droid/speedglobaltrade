import { NextRequest, NextResponse } from "next/server";
import { STORAGE_KEYS } from "@/lib/constants";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const cookie = request.cookies.get(STORAGE_KEYS.authCookie);
    if (!cookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
