export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);

export const formatPercent = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));

export const uid = () => crypto.randomUUID();

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
