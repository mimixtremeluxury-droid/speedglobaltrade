import { AppLocale, ExpertTrader, FeedActivity, InvestmentPlan, Testimonial, TrustBadge } from "@/lib/types";

export const APP_NAME = "Speed Global Trade";
export const SESSION_COOKIE = "sgt_session";
export const VERIFICATION_TOKEN_TTL_MS = 1000 * 60 * 20;
export const VERIFICATION_RESEND_COOLDOWN_MS = 1000 * 60;

export const LOCALES = ["en", "zh", "es", "ar", "hi"] as const satisfies readonly AppLocale[];
export const DEFAULT_LOCALE: AppLocale = "en";
export const RTL_LOCALES: AppLocale[] = ["ar"];

export const LANGUAGE_OPTIONS = [
  { locale: "en", label: "English", nativeLabel: "English", flag: "GB" },
  { locale: "zh", label: "Chinese", nativeLabel: "简体中文", flag: "CN" },
  { locale: "es", label: "Spanish", nativeLabel: "Español", flag: "ES" },
  { locale: "ar", label: "Arabic", nativeLabel: "العربية", flag: "SA" },
  { locale: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "IN" },
] as const satisfies ReadonlyArray<{
  locale: AppLocale;
  label: string;
  nativeLabel: string;
  flag: string;
}>;

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: "velocity-core",
    name: "Velocity Core",
    roiFrom: 6.2,
    minInvestment: 500,
    term: "30 Days",
    accent: "from-[#0f1f39] to-[#13294a]",
    summary: "Stable market exposure for disciplined portfolio builders.",
    markets: ["FX", "Commodities", "US Indices"],
  },
  {
    id: "aegis-income",
    name: "Aegis Income",
    roiFrom: 8.4,
    minInvestment: 1500,
    term: "45 Days",
    accent: "from-[#111d2f] to-[#1c3145]",
    summary: "Income-first allocation with active downside controls.",
    markets: ["Bonds", "Blue Chips", "Dividend ETFs"],
  },
  {
    id: "auric-alpha",
    name: "Auric Alpha",
    roiFrom: 11.7,
    minInvestment: 3500,
    term: "60 Days",
    accent: "from-[#2b1d0a] to-[#5b3a0f]",
    summary: "High-conviction strategy for growth-focused capital.",
    markets: ["NASDAQ", "AI Leaders", "Macro Trades"],
    premium: true,
  },
  {
    id: "quant-vault",
    name: "Quant Vault",
    roiFrom: 13.9,
    minInvestment: 6000,
    term: "75 Days",
    accent: "from-[#0b2430] to-[#09394f]",
    summary: "Signal-driven execution with institutional pacing.",
    markets: ["Quant Models", "Cross-Asset", "Momentum"],
  },
  {
    id: "sovereign-edge",
    name: "Sovereign Edge",
    roiFrom: 17.4,
    minInvestment: 12000,
    term: "90 Days",
    accent: "from-[#251509] to-[#4f2b08]",
    summary: "Premier-tier mandate for aggressive global allocations.",
    markets: ["Private Access", "Structured Trades", "FX Macro"],
    premium: true,
  },
];

export const EXPERT_TRADERS: ExpertTrader[] = [
  {
    id: "adrian-cole",
    name: "Adrian Cole",
    specialty: "Global Macro",
    winRate: 78,
    roi: 24.6,
    followers: "14.2k",
    risk: "Balanced",
    allocation: 1800,
    theme: "from-[#101c2e] to-[#17395d]",
    bio: "Builds around rate cycles, commodity rotations, and measured downside discipline.",
  },
  {
    id: "elena-navarro",
    name: "Elena Navarro",
    specialty: "Equity Momentum",
    winRate: 83,
    roi: 31.2,
    followers: "21.7k",
    risk: "High",
    allocation: 2200,
    theme: "from-[#271909] to-[#5f3c0b]",
    bio: "High-conviction momentum operator focused on liquid growth sectors.",
  },
  {
    id: "marcus-bennett",
    name: "Marcus Bennett",
    specialty: "Structured Income",
    winRate: 74,
    roi: 18.4,
    followers: "11.6k",
    risk: "Low",
    allocation: 1400,
    theme: "from-[#0f2020] to-[#104354]",
    bio: "Pairs dependable income strategies with capital preservation filters.",
  },
];

export const RECENT_ACTIVITY: FeedActivity[] = [
  { id: "1", investor: "Olivia", region: "Sydney", action: "deposited", amount: 500, createdAt: "2m ago" },
  { id: "2", investor: "Marisol", region: "Madrid", action: "copied", amount: 2200, createdAt: "6m ago" },
  { id: "3", investor: "Yuki", region: "Tokyo", action: "funded", amount: 1500, createdAt: "11m ago" },
  { id: "4", investor: "Daniel", region: "Toronto", action: "withdrew", amount: 890, createdAt: "18m ago" },
  { id: "5", investor: "Nora", region: "Zurich", action: "joined", amount: 5200, createdAt: "24m ago" },
];

export const TRUST_BADGES: TrustBadge[] = [
  { title: "AML & KYC Ready", caption: "Institutional onboarding controls" },
  { title: "256-bit Encryption", caption: "Bank-grade session protection" },
  { title: "24/7 Concierge Desk", caption: "Priority support for every client" },
];

export const SPONSORS = ["Arsenal", "Bloomberg", "Nasdaq", "Barclays", "PwC", "Mastercard", "Reuters", "Visa"];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "daniel",
    name: "Daniel Mercer",
    location: "Manchester, United Kingdom",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "liam",
    name: "Liam Carter",
    location: "Toronto, Canada",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    id: "sofia",
    name: "Sofia Morales",
    location: "Madrid, Spain",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "claire",
    name: "Claire Dubois",
    location: "Geneva, Switzerland",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
  },
];

export const CONTENT_PAGE_SLUGS = [
  "careers",
  "blog",
  "help-center",
  "security",
  "privacy-policy",
  "terms-of-service",
  "risk-disclosure",
] as const;
