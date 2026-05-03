import { getUserRecordById } from "@/lib/server/account-service";
import { getSessionUser } from "@/lib/session";

export async function getCurrentUserRecord() {
  const session = await getSessionUser();
  if (!session) {
    return null;
  }
  return getUserRecordById(session.userId);
}
