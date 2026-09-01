import { NextResponse } from "next/server";
import { copyTraderAllocation } from "@/lib/server/account-service";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { traderId?: string };
  if (!body.traderId) {
    return NextResponse.json({ error: "Missing copy-trading payload." }, { status: 400 });
  }

  try {
    const user = await copyTraderAllocation(session.userId, body.traderId);
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    const known = error as { message?: string; code?: string; status?: number };
    return NextResponse.json(
      { error: known.message ?? "Unable to copy this trader.", code: known.code ?? "copy_trade_failed" },
      { status: known.status ?? 400 },
    );
  }
}
