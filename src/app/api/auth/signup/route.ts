import { NextResponse } from "next/server";
import { requestSignupVerification } from "@/lib/server/auth-service";
import { matchesSmokeSecret } from "@/lib/session";
import { isAuthConfigurationError, toPublicAuthErrorMessage } from "@/lib/server/auth-config";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fullName?: string;
    email?: string;
    password?: string;
    country?: string;
    locale?: string;
  };

  if (!body.fullName || !body.email || !body.password || !body.country) {
    return NextResponse.json({ error: "Missing signup payload." }, { status: 400 });
  }

  try {
    const result = await requestSignupVerification({
      fullName: body.fullName,
      email: body.email,
      password: body.password,
      country: body.country,
      locale: body.locale,
      appBaseUrl: new URL(request.url).origin,
    });
    const includeSmokeVerifyUrl = matchesSmokeSecret(request.headers.get("x-auth-smoke-secret"));

    return NextResponse.json({
      ok: true,
      message: "A secure verification link has been sent to your email address.",
      ...(includeSmokeVerifyUrl ? { verifyUrl: result.verifyUrl } : {}),
    });
  } catch (error) {
    return NextResponse.json(
      { error: toPublicAuthErrorMessage(error, "Unable to create this account.") },
      { status: isAuthConfigurationError(error) ? 503 : 400 },
    );
  }
}
