"use client";

import { appSelectors, useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function CopyTradingPage() {
  const user = useAppStore((state) => state.user);
  const copyTrader = useAppStore((state) => state.copyTrader);
  const pushToast = useAppStore((state) => state.pushToast);
  const traders = appSelectors.traders();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="surface p-5">
        <p className="section-kicker">Copy Trading Mock</p>
        <h1 className="mt-2 font-heading text-3xl text-ink">Mirror high-performing strategies with one click</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-body/72">
          Compare each expert’s win rate, ROI, and following before allocating capital to their sleeve.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {traders.map((trader) => {
          const copied = user.copiedTraders.some((item) => item.traderId === trader.id);
          return (
            <article key={trader.id} className="surface overflow-hidden p-5">
              <div className={`rounded-[28px] bg-gradient-to-br ${trader.theme} p-5`}>
                <p className="text-xs uppercase tracking-[0.24em] text-body/65">{trader.specialty}</p>
                <h2 className="mt-2 font-heading text-3xl text-ink">{trader.name}</h2>
                <p className="mt-3 text-sm leading-7 text-body/78">{trader.bio}</p>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-4">
                <div>
                  <p className="metric-label">Win Rate</p>
                  <p className="mt-2 font-heading text-lg text-ink">{trader.winRate}%</p>
                </div>
                <div>
                  <p className="metric-label">ROI</p>
                  <p className="mt-2 font-heading text-lg text-gold">+{trader.roi}%</p>
                </div>
                <div>
                  <p className="metric-label">Followers</p>
                  <p className="mt-2 font-heading text-lg text-ink">{trader.followers}</p>
                </div>
              </div>
              <button
                type="button"
                disabled={copied}
                onClick={() => {
                  try {
                    copyTrader(trader);
                    pushToast({
                      title: "Trader copied",
                      description: `${trader.name} has been added to your copied allocation.`,
                      tone: "success",
                    });
                  } catch (error) {
                    pushToast({
                      title: "Copy failed",
                      description: (error as Error).message,
                      tone: "error",
                    });
                  }
                }}
                className={`mt-5 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
                  copied
                    ? "cursor-not-allowed border border-white/10 bg-white/[0.03] text-body/45"
                    : "bg-gold-gradient text-midnight hover:-translate-y-0.5"
                }`}
              >
                {copied ? "Already Copied" : `Copy with ${formatCurrency(trader.allocation)}`}
              </button>
            </article>
          );
        })}
      </section>

      <section className="surface p-5">
        <p className="section-kicker">Current Copied Allocations</p>
        <div className="mt-5 space-y-3">
          {user.copiedTraders.map((position) => (
            <div key={position.traderId} className="flex flex-col gap-3 rounded-3xl border border-white/8 bg-white/[0.03] p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-heading text-xl text-ink">{position.traderName}</p>
                <p className="text-sm text-body/65">Snapshot ROI +{position.roiSnapshot}%</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div>
                  <p className="metric-label">Allocation</p>
                  <p className="mt-2 font-heading text-lg text-ink">{formatCurrency(position.allocation)}</p>
                </div>
                <div>
                  <p className="metric-label">Copied</p>
                  <p className="mt-2 font-heading text-lg text-ink">{new Date(position.copiedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="metric-label">Exposure</p>
                  <p className="mt-2 font-heading text-lg text-gold">{formatCurrency(position.allocation * (1 + position.roiSnapshot / 100))}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
