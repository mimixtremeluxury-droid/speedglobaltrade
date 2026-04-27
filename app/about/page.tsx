import { Award, Globe2, Sparkles, Target } from "lucide-react";
import { PageShell } from "@/components/ui/page-shell";

export default function AboutPage() {
  return (
    <PageShell className="space-y-8">
      <h1 className="section-title">About Speed Global Trade</h1>
      <p className="max-w-3xl text-mutedText">
        We build premium investment experiences for modern investors by combining performance-driven plans with
        transparent risk visibility and intuitive tools.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {[{ icon: Target, title: "Mission" }, { icon: Globe2, title: "Vision" }, { icon: Sparkles, title: "Values" }].map(
          (item) => (
            <div key={item.title} className="glass p-5">
              <item.icon className="h-6 w-6 text-gold" />
              <h2 className="mt-2 font-heading text-xl">{item.title}</h2>
              <p className="mt-2 text-sm text-mutedText">Long-term trust, steady growth, and investor-first design.</p>
            </div>
          ),
        )}
      </div>
      <section className="glass p-6">
        <h2 className="font-heading text-2xl">Leadership Team</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Ava Reynolds - CEO", "Daniel Hart - CTO", "Maya Chen - Head of Risk"].map((member) => (
            <div key={member} className="rounded-xl bg-white/5 p-3 text-sm">
              {member}
            </div>
          ))}
        </div>
      </section>
      <section className="glass p-6">
        <h2 className="font-heading text-2xl">Achievements</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {["ISO-27001 Ready", "99.9% Uptime", "Top Fintech UX 2025"].map((badge) => (
            <span key={badge} className="inline-flex items-center gap-1 rounded-full border border-gold/40 px-3 py-1 text-xs">
              <Award className="h-3 w-3 text-gold" /> {badge}
            </span>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
