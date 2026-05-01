import { ActivityFeed } from "@/components/marketing/activity-feed";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { PageTransition } from "@/components/ui/page-transition";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="relative overflow-x-hidden">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <ActivityFeed />
    </div>
  );
}
