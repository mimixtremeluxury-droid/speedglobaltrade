export type PlanRisk = "Low" | "Moderate" | "High";
export type TransactionType = "deposit" | "withdrawal" | "earning" | "investment";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface InvestmentPlan {
  id: string;
  name: string;
  minDeposit: number;
  weeklyRoi: number;
  bonusRoi?: number;
  lockDays: number;
  risk: PlanRisk;
}

export interface Investment {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  startDate: string;
  endDate: string;
  claimed: boolean;
  status: "active" | "matured" | "completed";
  estimatedReturn: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  method?: string;
  walletAddress?: string;
  createdAt: string;
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
  password: string;
  twoFactorEnabled: boolean;
}

export interface UserData {
  profile: UserProfile;
  balance: number;
  totalInvested: number;
  totalReturns: number;
  investments: Investment[];
  transactions: Transaction[];
}
