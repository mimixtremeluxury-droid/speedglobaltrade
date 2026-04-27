import { InvestmentPlan } from "@/lib/types";

export const STORAGE_KEYS = {
  users: "sgt_users",
  activeUserEmail: "sgt_active_user_email",
  authCookie: "sgt_auth",
} as const;

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  { id: "basic", name: "Basic", minDeposit: 100, weeklyRoi: 0.05, lockDays: 30, risk: "Low" },
  {
    id: "standard",
    name: "Standard",
    minDeposit: 500,
    weeklyRoi: 0.08,
    lockDays: 60,
    risk: "Moderate",
  },
  {
    id: "elite",
    name: "Elite",
    minDeposit: 2000,
    weeklyRoi: 0.12,
    bonusRoi: 0.02,
    lockDays: 90,
    risk: "High",
  },
  {
    id: "premium",
    name: "Premium",
    minDeposit: 5000,
    weeklyRoi: 0.15,
    bonusRoi: 0.05,
    lockDays: 180,
    risk: "High",
  },
];
