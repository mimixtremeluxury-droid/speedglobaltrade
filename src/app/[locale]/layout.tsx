import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LocaleEnhancers } from "@/components/locale-enhancers";
import { RTL_LOCALES } from "@/lib/constants";
import { routing } from "@/i18n/routing";
import { AppLocale } from "@/lib/types";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
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

  setRequestLocale(locale);

  const messages = await getMessages({ locale });
  const dir = RTL_LOCALES.includes(locale as AppLocale) ? "rtl" : "ltr";

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleEnhancers locale={locale} dir={dir} />
      <div className="min-h-screen" dir={dir}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
