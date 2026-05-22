import { NextResponse } from "next/server";
import { requestLoginVerification } from "@/lib/server/auth-service";
import { getSessionSecret } from "@/lib/session";

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
    const includeSmokeVerifyUrl = request.headers.get("x-auth-smoke-secret") === getSessionSecret();

    return NextResponse.json({
      ok: true,
      message: "If the credentials are valid, a secure verification link has been sent.",
      ...(includeSmokeVerifyUrl && result.verifyUrl ? { verifyUrl: result.verifyUrl } : {}),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start the secure login flow." },
      { status: 400 },
    );
  }
}
