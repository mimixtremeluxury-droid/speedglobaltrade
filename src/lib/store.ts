"use client";

import { create } from "zustand";
import { EXPERT_TRADERS, INVESTMENT_PLANS, RECENT_ACTIVITY } from "@/lib/constants";
import { FeedActivity, SessionUser, UserRecord } from "@/lib/types";

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
  locale: UserRecord["profile"]["locale"];
};

type MutationResponse = {
  ok: boolean;
  user: UserRecord;
};

type AppStore = {
  hydrated: boolean;
  session: SessionUser | null;
  user: UserRecord | null;
  sidebarCollapsed: boolean;
  feed: FeedActivity[];
  toasts: Toast[];
  hydrate: (session: SessionUser | null, user: UserRecord | null) => void;
  setSessionUser: (session: SessionUser | null, user?: UserRecord | null) => void;
  signIn: (email: string, password: string, locale: UserRecord["profile"]["locale"]) => Promise<void>;
  signUp: (payload: AuthPayload) => Promise<void>;
  signOut: () => void;
  requestDeposit: (amount: number, method: string) => Promise<void>;
  completeDeposit: (transactionId: string) => Promise<void>;
  withdraw: (amount: number, method: string) => Promise<void>;
  invest: (planId: string, amount: number) => Promise<void>;
  copyTrader: (traderId: string) => Promise<void>;
  updateSettings: (patch: Partial<Pick<UserRecord["profile"], "fullName" | "country" | "locale" | "twoFactorEnabled">>) => Promise<void>;
  setSidebarCollapsed: (collapsed: boolean) => void;
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
};

const createToastId = () => crypto.randomUUID();

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "The request could not be completed.");
  }
  return payload;
}

export const useAppStore = create<AppStore>((set, get) => ({
  hydrated: false,
  session: null,
  user: null,
  sidebarCollapsed: false,
  feed: RECENT_ACTIVITY,
  toasts: [],
  hydrate: (session, user) => {
    set({
      hydrated: true,
      session,
      user,
      feed: RECENT_ACTIVITY,
    });
  },
  setSessionUser: (session, user) => {
    set({
      session,
      user: user ?? get().user,
    });
  },
  signIn: async (email, password, locale) => {
    await requestJson<{ ok: true; message: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, locale }),
    });
  },
  signUp: async (payload) => {
    await requestJson<{ ok: true; message: string }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  signOut: () => set({ session: null, user: null }),
  requestDeposit: async (amount, method) => {
    const payload = await requestJson<MutationResponse>("/api/dashboard/deposits", {
      method: "POST",
      body: JSON.stringify({ amount, method }),
    });
    set({ user: payload.user });
  },
  completeDeposit: async (transactionId) => {
    const payload = await requestJson<MutationResponse>(`/api/dashboard/deposits/${transactionId}/complete`, {
      method: "POST",
    });
    set({ user: payload.user });
  },
  withdraw: async (amount, method) => {
    const payload = await requestJson<MutationResponse>("/api/dashboard/withdrawals", {
      method: "POST",
      body: JSON.stringify({ amount, method }),
    });
    set({ user: payload.user });
  },
  invest: async (planId, amount) => {
    const payload = await requestJson<MutationResponse>("/api/dashboard/investments", {
      method: "POST",
      body: JSON.stringify({ planId, amount }),
    });
    set({ user: payload.user });
  },
  copyTrader: async (traderId) => {
    const payload = await requestJson<MutationResponse>("/api/dashboard/copy-trading", {
      method: "POST",
      body: JSON.stringify({ traderId }),
    });
    set({ user: payload.user });
  },
  updateSettings: async (patch) => {
    const payload = await requestJson<MutationResponse>("/api/dashboard/settings", {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    set({ user: payload.user });
  },
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
