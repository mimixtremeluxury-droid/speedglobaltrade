import createMiddleware from "next-intl/middleware";
import { hasLocale } from "next-intl";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { verifySessionToken } from "@/lib/session";
import { DEFAULT_LOCALE, SESSION_COOKIE } from "@/lib/constants";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const locale = hasLocale(routing.locales, maybeLocale) ? maybeLocale : null;
  const localizedPathname = locale ? `/${segments.slice(1).join("/")}` || "/" : pathname;

  if (!locale && (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/dashboard"))) {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url));
  }

  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (locale && localizedPathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (locale && (localizedPathname === "/login" || localizedPathname === "/signup") && session) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
