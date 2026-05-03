import { NextResponse } from "next/server";
import { completePendingDeposit } from "@/lib/server/account-service";
import { getSessionUser } from "@/lib/session";

export async function POST(
  _request: Request,
  context: {
    params: Promise<{ transactionId: string }>;
  },
) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
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
