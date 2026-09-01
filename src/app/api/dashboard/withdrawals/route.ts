import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { withdrawFromAccount } from "@/lib/server/account-service";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    amount?: number;
    method?: string;
    usdtAddress?: string;
    paypalEmail?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankRoutingNumber?: string;
    cashAppTag?: string;
  };
  if (typeof body.amount !== "number" || !body.method) {
    return NextResponse.json({ error: "Missing withdrawal payload." }, { status: 400 });
  }
  const requestId = request.headers.get("Idempotency-Key");
  if (!requestId) return NextResponse.json({ error: "A withdrawal idempotency key is required." }, { status: 400 });

  try {
    const result = await withdrawFromAccount(session.userId, body.amount, body.method, {
      usdtAddress: body.usdtAddress,
      paypalEmail: body.paypalEmail,
      bankName: body.bankName,
      bankAccountNumber: body.bankAccountNumber,
      bankRoutingNumber: body.bankRoutingNumber,
      cashAppTag: body.cashAppTag,
    }, requestId);
    return NextResponse.json({ ok: true, user: result.user, withdrawalCode: result.withdrawalCode });
  } catch (error) {
    const known = error as { message?: string; code?: string; status?: number };
    return NextResponse.json(
      { error: known.message ?? "Unable to create the withdrawal request.", code: known.code ?? "withdrawal_request_failed" },
      { status: known.status ?? 400 },
    );
  }
}
