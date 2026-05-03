import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { investInPlan } from "@/lib/server/account-service";

export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { amount?: number; planId?: string };
  if (typeof body.amount !== "number" || !body.planId) {
    return NextResponse.json({ error: "Missing investment payload." }, { status: 400 });
  }

  try {
    const user = await investInPlan(session.userId, body.planId, body.amount);
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to activate this plan." },
      { status: 400 },
    );
  }
}
