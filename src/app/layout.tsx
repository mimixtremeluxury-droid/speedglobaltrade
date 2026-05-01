import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/app/providers";
import { getSessionUser } from "@/lib/session";
import { ToastStack } from "@/components/ui/toast-stack";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Speed Global Trade",
  description: "A premium investment platform with multilingual marketing surfaces and refined dashboard experiences.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSessionUser();

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-midnight text-body antialiased">
        <AppProviders initialSession={session}>
          {children}
          <ToastStack />
        </AppProviders>
      </body>
    </html>
  );
}
