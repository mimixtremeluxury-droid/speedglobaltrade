import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/app/providers";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ToastStack } from "@/components/ui/toast-stack";
import { PageTransition } from "@/components/ui/page-transition";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Speed Global Trade",
  description: "Premium modern investment platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full bg-premium-gradient text-white">
        <AppProvider>
          <SiteHeader />
          <main className="relative min-h-[calc(100vh-136px)] overflow-x-hidden">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
          <ToastStack />
        </AppProvider>
      </body>
    </html>
  );
}
