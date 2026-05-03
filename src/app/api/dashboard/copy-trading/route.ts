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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to copy this trader." },
      { status: 400 },
    );
  }
}
