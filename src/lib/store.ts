"use client";

import { create } from "zustand";
import { DEMO_CREDENTIALS, EXPERT_TRADERS, INVESTMENT_PLANS, RECENT_ACTIVITY } from "@/lib/constants";
import {
  copyTraderAllocation,
  createMockAccount,
  depositToAccount,
  getDemoRecord,
  getUserRecord,
  investInPlan,
  seedMockDb,
  updateUserSettings,
  validateCredentials,
  withdrawFromAccount,
} from "@/lib/mockDb";
import { ExpertTrader, FeedActivity, InvestmentPlan, SessionUser, UserRecord } from "@/lib/types";

type Toast = {
  id: string;
  title: string;
  description: string;
  tone: "success" | "error" | "info";
};

type AuthPayload = {
  fullName: string;
  email: string;
  password: string;
  country: string;
};

type AppStore = {
  hydrated: boolean;
  session: SessionUser | null;
  user: UserRecord | null;
  chatOpen: boolean;
  sidebarCollapsed: boolean;
  feed: FeedActivity[];
  toasts: Toast[];
  hydrate: (session: SessionUser | null) => void;
  setSessionUser: (session: SessionUser | null) => void;
  signIn: (email: string, password: string) => UserRecord;
  signUp: (payload: AuthPayload) => UserRecord;
  useDemoAccount: () => UserRecord;
  signOut: () => void;
  deposit: (amount: number, method: string) => void;
  withdraw: (amount: number, method: string) => void;
  invest: (plan: InvestmentPlan, amount: number) => void;
  copyTrader: (trader: ExpertTrader) => void;
  updateSettings: (patch: Parameters<typeof updateUserSettings>[1]) => void;
  setChatOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
};

const createToastId = () => crypto.randomUUID();

export const useAppStore = create<AppStore>((set, get) => ({
  hydrated: false,
  session: null,
  user: null,
  chatOpen: false,
  sidebarCollapsed: false,
  feed: RECENT_ACTIVITY,
  toasts: [],
  hydrate: (session) => {
    seedMockDb();
    const nextUser = session ? getUserRecord(session.email) : null;
    set({
      hydrated: true,
      session,
      user: nextUser,
      feed: RECENT_ACTIVITY,
    });
  },
  setSessionUser: (session) => {
    set({
      session,
      user: session ? getUserRecord(session.email) : null,
    });
  },
  signIn: (email, password) => {
    const user = validateCredentials(email, password);
    set({ user, session: { email: user.profile.email, fullName: user.profile.fullName } });
    return user;
  },
  signUp: (payload) => {
    const user = createMockAccount(payload);
    set({ user, session: { email: user.profile.email, fullName: user.profile.fullName } });
    return user;
  },
  useDemoAccount: () => {
    const user = getDemoRecord();
    if (!user) throw new Error(`Demo account ${DEMO_CREDENTIALS.email} is unavailable.`);
    set({ user, session: { email: user.profile.email, fullName: user.profile.fullName } });
    return user;
  },
  signOut: () => set({ session: null, user: null, chatOpen: false }),
  deposit: (amount, method) => {
    const email = get().session?.email;
    if (!email) throw new Error("No active session.");
    const user = depositToAccount(email, amount, method);
    set({ user });
  },
  withdraw: (amount, method) => {
    const email = get().session?.email;
    if (!email) throw new Error("No active session.");
    const user = withdrawFromAccount(email, amount, method);
    set({ user });
  },
  invest: (plan, amount) => {
    const email = get().session?.email;
    if (!email) throw new Error("No active session.");
    const user = investInPlan(email, plan, amount);
    set({ user });
  },
  copyTrader: (trader) => {
    const email = get().session?.email;
    if (!email) throw new Error("No active session.");
    const user = copyTraderAllocation(email, trader);
    set({ user });
  },
  updateSettings: (patch) => {
    const email = get().session?.email;
    if (!email) throw new Error("No active session.");
    const user = updateUserSettings(email, patch);
    set({ user });
  },
  setChatOpen: (chatOpen) => set({ chatOpen }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  pushToast: (toast) => {
    const nextToast = { ...toast, id: createToastId() };
    set((state) => ({ toasts: [...state.toasts, nextToast] }));
    setTimeout(() => {
      get().dismissToast(nextToast.id);
    }, 3600);
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

export const appSelectors = {
  plans: () => INVESTMENT_PLANS,
  traders: () => EXPERT_TRADERS,
};
