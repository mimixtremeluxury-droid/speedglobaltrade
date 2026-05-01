import { redirect } from "next/navigation";
import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { getSessionUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await getSessionUser();
  const { locale } = await params;

  if (!session) {
    redirect(`/${locale}/login`);
  }

  return <DashboardFrame>{children}</DashboardFrame>;
}
