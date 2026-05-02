import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { PageShell } from "@/components/ui/page-shell";
import { CONTENT_PAGE_SLUGS } from "@/lib/constants";

type ContentPage = {
  eyebrow: string;
  title: string;
  description: string;
  sectionOneTitle: string;
  sectionOneBody: string;
  sectionTwoTitle: string;
  sectionTwoBody: string;
  sectionThreeTitle: string;
  sectionThreeBody: string;
};

export default async function MarketingInfoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!CONTENT_PAGE_SLUGS.includes(slug as (typeof CONTENT_PAGE_SLUGS)[number])) {
    notFound();
  }

  const messages = (await getMessages({ locale })) as {
    contentPages?: Record<string, ContentPage>;
  };
  const page = messages.contentPages?.[slug];

  if (!page) {
    notFound();
  }

  return (
    <PageShell className="space-y-12 pb-24 pt-12">
      <section className="surface px-6 py-10 md:px-10">
        <p className="section-kicker">{page.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-heading text-4xl tracking-[-0.04em] text-ink md:text-6xl">{page.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-body/78">{page.description}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: page.sectionOneTitle, body: page.sectionOneBody },
          { title: page.sectionTwoTitle, body: page.sectionTwoBody },
          { title: page.sectionThreeTitle, body: page.sectionThreeBody },
        ].map((section) => (
          <article key={section.title} className="surface p-6">
            <h2 className="font-heading text-2xl text-ink">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-body/74">{section.body}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
