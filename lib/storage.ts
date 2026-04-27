import { INVESTMENT_PLANS, STORAGE_KEYS } from "@/lib/constants";
import { Investment, Transaction, UserData, UserProfile } from "@/lib/types";
import { uid } from "@/lib/utils";

type Users = Record<string, UserData>;

const hasWindow = () => typeof window !== "undefined";

const getUsers = (): Users => {
  if (!hasWindow()) return {};
  const raw = localStorage.getItem(STORAGE_KEYS.users);
  return raw ? (JSON.parse(raw) as Users) : {};
};

const saveUsers = (users: Users) => localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));

export const getActiveUserEmail = () =>
  hasWindow() ? localStorage.getItem(STORAGE_KEYS.activeUserEmail) : null;

export const getActiveUser = (): UserData | null => {
  const email = getActiveUserEmail();
  if (!email) return null;
  return getUsers()[email] ?? null;
};

export const setActiveSession = (email: string) => {
  localStorage.setItem(STORAGE_KEYS.activeUserEmail, email);
  document.cookie = `${STORAGE_KEYS.authCookie}=1; path=/; max-age=604800`;
};

export const clearActiveSession = () => {
  localStorage.removeItem(STORAGE_KEYS.activeUserEmail);
  document.cookie = `${STORAGE_KEYS.authCookie}=; path=/; max-age=0`;
};

export const createUser = (profile: UserProfile) => {
  const users = getUsers();
  if (users[profile.email]) throw new Error("Account already exists.");
  users[profile.email] = {
    profile,
    balance: 0,
    totalInvested: 0,
    totalReturns: 0,
    investments: [],
    transactions: [],
  };
  saveUsers(users);
};

export const loginUser = (email: string, password: string) => {
  const user = getUsers()[email];
  if (!user || user.profile.password !== password) throw new Error("Invalid email or password.");
  setActiveSession(email);
  return user;
};

export const ensureDemoUser = () => {
  const users = getUsers();
  if (!users["demo@speedglobaltrade.com"]) {
    const now = new Date();
    const plan = INVESTMENT_PLANS[1];
    const endDate = new Date(now);
    endDate.setDate(now.getDate() + plan.lockDays);
    const amount = 1200;
    const roi = plan.weeklyRoi + (plan.bonusRoi ?? 0);
    users["demo@speedglobaltrade.com"] = {
      profile: {
        name: "Demo Investor",
        email: "demo@speedglobaltrade.com",
        password: "Demo@12345",
        twoFactorEnabled: false,
      },
      balance: 5000,
      totalInvested: amount,
      totalReturns: 0,
      investments: [
        {
          id: uid(),
          planId: plan.id,
          planName: plan.name,
          amount,
          startDate: now.toISOString(),
          endDate: endDate.toISOString(),
          claimed: false,
          status: "active",
          estimatedReturn: amount * roi,
        },
      ],
      transactions: [],
    };
    saveUsers(users);
  }
  setActiveSession("demo@speedglobaltrade.com");
  return users["demo@speedglobaltrade.com"];
};

export const updateActiveUser = (updater: (current: UserData) => UserData) => {
  const email = getActiveUserEmail();
  if (!email) throw new Error("No active user.");
  const users = getUsers();
  const current = users[email];
  if (!current) throw new Error("User not found.");
  users[email] = updater(current);
  saveUsers(users);
  return users[email];
};

export const addTransaction = (user: UserData, transaction: Omit<Transaction, "id" | "createdAt">): UserData => ({
  ...user,
  transactions: [{ ...transaction, id: uid(), createdAt: new Date().toISOString() }, ...user.transactions],
});

export const refreshInvestments = (investments: Investment[]): Investment[] => {
  const now = new Date();
  return investments.map((investment) => {
    if (investment.claimed) return { ...investment, status: "completed" };
    if (now >= new Date(investment.endDate)) return { ...investment, status: "matured" };
    return { ...investment, status: "active" };
  });
};
