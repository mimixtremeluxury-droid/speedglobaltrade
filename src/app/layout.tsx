import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/app/providers";
import { getUserRecordById } from "@/lib/server/account-service";
import { getSessionUser } from "@/lib/session";
import { ToastStack } from "@/components/ui/toast-stack";

export const metadata: Metadata = {
  title: "Speed Global Trade",
  description: "A premium investment platform with multilingual marketing surfaces and refined dashboard experiences.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSessionUser();
  const user = session ? await getUserRecordById(session.userId) : null;

  return (
    <html lang="en">
      <body className="min-h-screen bg-midnight text-body antialiased">
        <AppProviders initialSession={session} initialUser={user}>
          {children}
          <ToastStack />
        </AppProviders>
      </body>
    </html>
  );
}
