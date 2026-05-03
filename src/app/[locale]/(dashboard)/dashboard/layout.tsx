import { redirect } from "next/navigation";
import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { getCurrentUserRecord } from "@/lib/server/current-user";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const user = await getCurrentUserRecord();
  const { locale } = await params;

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return <DashboardFrame>{children}</DashboardFrame>;
}
