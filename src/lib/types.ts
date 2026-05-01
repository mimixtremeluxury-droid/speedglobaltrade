export type AppLocale = "en" | "es";
export type RiskLabel = "Low" | "Balanced" | "High";
export type TransactionKind = "deposit" | "withdrawal" | "earning" | "investment" | "copy_trade";
export type TransactionStatus = "completed" | "pending";

export interface SessionUser {
  email: string;
  fullName: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  password: string;
  country: string;
  joinedAt: string;
  locale: AppLocale;
  tier: "Signature" | "Premier" | "Institutional";
  twoFactorEnabled: boolean;
}

export interface UserSummary {
  cashBalance: number;
  totalPortfolioValue: number;
  activeCapital: number;
  totalReturnsPct: number;
  dailyChange: number;
  totalEarnings: number;
}

export interface PortfolioPoint {
  label: string;
  value: number;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  roiFrom: number;
  minInvestment: number;
  term: string;
  accent: string;
  summary: string;
  markets: string[];
  premium?: boolean;
}

export interface InvestmentPosition {
  id: string;
  planId: string;
  planName: string;
  principal: number;
  roiFrom: number;
  startedAt: string;
  term: string;
  status: "active" | "scaling";
  accent: string;
}

export interface ExpertTrader {
  id: string;
  name: string;
  specialty: string;
  winRate: number;
  roi: number;
  followers: string;
  risk: RiskLabel;
  allocation: number;
  theme: string;
  bio: string;
}

export interface CopiedTraderPosition {
  traderId: string;
  traderName: string;
  allocation: number;
  copiedAt: string;
  roiSnapshot: number;
}

export interface TransactionRecord {
  id: string;
  kind: TransactionKind;
  label: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  note: string;
  method?: string;
}

export interface FeedActivity {
  id: string;
  investor: string;
  region: string;
  action: string;
  amount: number;
  createdAt: string;
}

export interface TrustBadge {
  title: string;
  caption: string;
}

export interface UserRecord {
  profile: UserProfile;
  summary: UserSummary;
  performance: PortfolioPoint[];
  investments: InvestmentPosition[];
  copiedTraders: CopiedTraderPosition[];
  transactions: TransactionRecord[];
}

export interface MockDatabase {
  users: Record<string, UserRecord>;
}
