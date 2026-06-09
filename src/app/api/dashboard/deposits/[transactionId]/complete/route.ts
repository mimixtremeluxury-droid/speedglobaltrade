import { NextResponse } from "next/server";
import { completePendingDeposit } from "@/lib/server/account-service";
import { getSessionUser, matchesSmokeSecret } from "@/lib/session";

export async function POST(
  request: Request,
  context: {
    params: Promise<{ transactionId: string }>;
  },
) {
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to complete the deposit." },
      { status: 400 },
    );
  }
}
