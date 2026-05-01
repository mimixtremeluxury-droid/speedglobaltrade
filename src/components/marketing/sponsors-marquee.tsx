import { SPONSORS } from "@/lib/constants";

export function SponsorsMarquee() {
  const items = [...SPONSORS, ...SPONSORS];

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/8 bg-white/[0.03] py-4">
      <div className="flex min-w-max gap-4 px-4 animate-marquee">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-body/75 transition hover:border-gold/25 hover:text-ink"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
