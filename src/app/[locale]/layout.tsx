import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/ui/page-transition";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ActivityFeed } from "@/components/marketing/activity-feed";
import { ChatWidget } from "@/components/marketing/chat-widget";
import { routing } from "@/i18n/routing";

export default async function PublicLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen">
        <SiteHeader />
        <main className="relative overflow-x-hidden">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
        <ActivityFeed />
        <ChatWidget />
      </div>
    </NextIntlClientProvider>
  );
}
