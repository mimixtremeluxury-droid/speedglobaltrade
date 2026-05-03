import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { requestDeposit } from "@/lib/server/account-service";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { amount?: number; method?: string };
  if (typeof body.amount !== "number" || !body.method) {
    return NextResponse.json({ error: "Missing deposit payload." }, { status: 400 });
  }

  try {
    const user = await requestDeposit(session.userId, body.amount, body.method);
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create the deposit request." },
      { status: 400 },
    );
  }
}
