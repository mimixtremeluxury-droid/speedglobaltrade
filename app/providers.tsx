"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { INVESTMENT_PLANS } from "@/lib/constants";
import { addTransaction, clearActiveSession, getActiveUser, refreshInvestments, updateActiveUser } from "@/lib/storage";
import { InvestmentPlan, UserData } from "@/lib/types";

interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
}

interface AppContextValue {
  user: UserData | null;
  loading: boolean;
  toasts: Toast[];
  pushToast: (type: Toast["type"], message: string) => void;
  refreshUser: () => void;
  logout: () => void;
  deposit: (amount: number, method: string) => void;
  withdraw: (amount: number, walletAddress: string) => void;
  invest: (amount: number, plan: InvestmentPlan) => void;
  claimReturns: (investmentId: string) => void;
  updateProfile: (payload: Partial<UserData["profile"]>) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used in AppProvider.");
  return ctx;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const refreshUser = () => {
    const active = getActiveUser();
    if (!active) {
      setUser(null);
      setLoading(false);
      return;
    }
    setUser({ ...active, investments: refreshInvestments(active.investments) });
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const pushToast = (type: Toast["type"], message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3500);
  };

  const updateAndSet = (updater: (current: UserData) => UserData) => {
    const updated = updateActiveUser(updater);
    setUser({ ...updated, investments: refreshInvestments(updated.investments) });
  };

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      loading,
      toasts,
      pushToast,
      refreshUser,
      logout: () => {
        clearActiveSession();
        setUser(null);
      },
      deposit: (amount, method) => {
        updateAndSet((current) =>
          addTransaction(
            { ...current, balance: current.balance + amount },
            { type: "deposit", amount, status: "completed", method, description: `Deposit via ${method}` },
          ),
        );
      },
      withdraw: (amount, walletAddress) => {
        updateAndSet((current) => {
          if (amount > current.balance) throw new Error("Insufficient balance.");
          return addTransaction(
            { ...current, balance: current.balance - amount },
            {
              type: "withdrawal",
              amount,
              status: "pending",
              walletAddress,
              description: "Withdrawal request created",
            },
          );
        });
      },
      invest: (amount, plan) => {
        updateAndSet((current) => {
          if (amount > current.balance) throw new Error("Insufficient balance.");
          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + plan.lockDays);
          const roi = plan.weeklyRoi + (plan.bonusRoi ?? 0);
          return addTransaction(
            {
              ...current,
              balance: current.balance - amount,
              totalInvested: current.totalInvested + amount,
              investments: [
                {
                  id: crypto.randomUUID(),
                  planId: plan.id,
                  planName: plan.name,
                  amount,
                  startDate: startDate.toISOString(),
                  endDate: endDate.toISOString(),
                  claimed: false,
                  status: "active",
                  estimatedReturn: amount * roi,
                },
                ...current.investments,
              ],
            },
            { type: "investment", amount, status: "completed", description: `${plan.name} plan investment` },
          );
        });
      },
      claimReturns: (investmentId) => {
        updateAndSet((current) => {
          const target = current.investments.find((entry) => entry.id === investmentId);
          if (!target || target.claimed || new Date() < new Date(target.endDate)) {
            throw new Error("Investment is not yet claimable.");
          }
          const profit = target.estimatedReturn;
          return addTransaction(
            {
              ...current,
              balance: current.balance + profit,
              totalReturns: current.totalReturns + profit,
              investments: current.investments.map((entry) =>
                entry.id === investmentId ? { ...entry, claimed: true, status: "completed" } : entry,
              ),
            },
            { type: "earning", amount: profit, status: "completed", description: `${target.planName} returns claimed` },
          );
        });
      },
      updateProfile: (payload) => {
        updateAndSet((current) => ({ ...current, profile: { ...current.profile, ...payload } }));
      },
    }),
    [user, loading, toasts],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const dailyEstimate = (user: UserData | null) => {
  if (!user) return 0;
  return user.investments
    .filter((item) => item.status === "active")
    .reduce((sum, item) => {
      const plan = INVESTMENT_PLANS.find((entry) => entry.id === item.planId);
      if (!plan) return sum;
      const daily = (item.amount * (plan.weeklyRoi + (plan.bonusRoi ?? 0))) / 7;
      return sum + daily;
    }, 0);
};
