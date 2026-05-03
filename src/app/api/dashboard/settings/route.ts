import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { updateUserSettings } from "@/lib/server/account-service";

export async function PATCH(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    fullName?: string;
    country?: string;
    locale?: "en" | "zh" | "es" | "ar" | "hi";
    twoFactorEnabled?: boolean;
  };

  try {
    const user = await updateUserSettings(session.userId, body);
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update your settings." },
      { status: 400 },
    );
  }
}
