import { NextResponse } from "next/server";
import { completePendingDeposit } from "@/lib/server/account-service";
import { getSessionUser, matchesSmokeSecret } from "@/lib/session";

export async function POST(
  request: Request,
  context: {
    params: Promise<{ transactionId: string }>;
  },
) {
  if (process.env.NODE_ENV === "production" || process.env.SGT_ENABLE_LEGACY_DEPOSIT_SMOKE_COMPLETE !== "true") {
    return NextResponse.json({ error: "legacy_deposit_completion_disabled" }, { status: 410 });
  }

  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!matchesSmokeSecret(request.headers.get("x-auth-smoke-secret"))) {
    return NextResponse.json({ error: "Deposit approval is restricted to operations." }, { status: 403 });
  }

  const { transactionId } = await context.params;
  try {
    const user = await completePendingDeposit(session.userId, transactionId);
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    const known = error as { message?: string; code?: string; status?: number };
    return NextResponse.json(
      { error: known.message ?? "Unable to complete the deposit.", code: known.code ?? "deposit_completion_failed" },
      { status: known.status ?? 400 },
    );
  }
}
