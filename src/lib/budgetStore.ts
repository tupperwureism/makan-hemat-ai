// Simple in-memory store shared across routes (also persisted to sessionStorage)
export type BudgetMode = "sekali" | "harian" | "bulanan";

export type BudgetState = {
  budget: number;
  mode: BudgetMode;
  days: number; // total days (1 for sekali)
  criteria: string[];
};

const KEY = "warungbudget-state";

export const defaultState: BudgetState = {
  budget: 100000,
  mode: "harian",
  days: 7,
  criteria: [],
};

export function saveState(s: BudgetState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

export function loadState(): BudgetState {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch {}
  return defaultState;
}

export function perDayBudget(s: BudgetState) {
  if (s.mode === "sekali") return s.budget; // per meal
  return s.budget / Math.max(1, s.days);
}
