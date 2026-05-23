import { NextResponse } from "next/server";
import { requestLoginVerification } from "@/lib/server/auth-service";
import { matchesSmokeSecret } from "@/lib/session";
import { isAuthConfigurationError, toPublicAuthErrorMessage } from "@/lib/server/auth-config";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string; locale?: string };
  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Missing login payload." }, { status: 400 });
  }

  try {
    const result = await requestLoginVerification({
      email: body.email,
      password: body.password,
      locale: body.locale,
      appBaseUrl: new URL(request.url).origin,
    });
    const includeSmokeVerifyUrl = matchesSmokeSecret(request.headers.get("x-auth-smoke-secret"));

    return NextResponse.json({
      ok: true,
      message: "If the credentials are valid, a secure verification link has been sent.",
      ...(includeSmokeVerifyUrl && result.verifyUrl ? { verifyUrl: result.verifyUrl } : {}),
    });
  } catch (error) {
    return NextResponse.json(
      { error: toPublicAuthErrorMessage(error, "Unable to start the secure login flow.") },
      { status: isAuthConfigurationError(error) ? 503 : 400 },
    );
  }
}
