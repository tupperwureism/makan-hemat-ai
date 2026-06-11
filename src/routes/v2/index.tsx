import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Utensils, ChefHat, Moon, Sun, Settings } from "lucide-react";
import {
  defaultState,
  loadState,
  saveState,
  type BudgetMode,
  perDayBudget,
} from "@/lib/budgetStore";
import { criteriaOptions, formatRp } from "@/lib/mockData";

export const Route = createFileRoute("/v2/")({
  head: () => ({
    meta: [
      { title: "WarungBudget AI v2 — Makan Hemat, Gizi Tetap Terjaga" },
      {
        name: "description",
        content: "Atur budget makan mahasiswa v2 dengan database dinamis & glassmorphism.",
      },
    ],
  }),
  component: BudgetInputV2,
});

const DAY_OPTIONS = [1, 2, 3, 7, 14, 30];

function formatNumber(n: string) {
  const digits = n.replace(/\D/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("id-ID");
}

function BudgetInputV2() {
  const navigate = useNavigate();
  const [state, setState] = useState(defaultState);
  const [budgetStr, setBudgetStr] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load Dark Mode state
    const isDarkStored =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkStored);
    if (isDarkStored) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const s = loadState();
    setState(s);
    setBudgetStr(s.budget ? s.budget.toLocaleString("id-ID") : "");
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const setMode = (mode: BudgetMode) => {
    setState((s) => ({
      ...s,
      mode,
      days: mode === "sekali" ? 1 : mode === "bulanan" ? 30 : s.days || 7,
    }));
  };

  const toggleCriteria = (id: string) => {
    setState((s) => ({
      ...s,
      criteria: s.criteria.includes(id) ? s.criteria.filter((c) => c !== id) : [...s.criteria, id],
    }));
  };

  const perUnit = useMemo(() => perDayBudget(state), [state]);

  const onSubmit = () => {
    saveState(state);
    navigate({ to: "/v2/hasil" });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50/50 to-orange-100/20 dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-400/10 dark:bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-amber-400/10 dark:bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-xl px-4 py-8 sm:py-12 relative z-10">
        {/* Navigation & Controls bar */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/v2/admin"
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-border"
          >
            <Settings className="h-3.5 w-3.5" /> Admin Panel
          </Link>
          <div className="flex gap-2">
            <Link
              to="/"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-border"
            >
              Kembali ke v1
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md border border-border hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all active:scale-95"
              title="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-zinc-700" />
              )}
            </button>
          </div>
        </div>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 dark:bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-600 dark:text-orange-400 mb-3 border border-orange-500/20">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Versi 2.0 (Dinamis & Estetik)
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground bg-clip-text">
            Warung
            <span className="text-orange-500 drop-shadow-[0_2px_10px_rgba(249,115,22,0.15)]">
              Budget
            </span>{" "}
            AI
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Makan Hemat, Gizi Tetap Terjaga. Dihubungkan dengan database lokal dinamis.
          </p>
        </header>

        {/* Glassmorphism Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative border">
          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm font-semibold tracking-wide text-foreground">
              Masukkan Budget Kamu
            </Label>
            <div className="relative mt-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">
                Rp
              </span>
              <Input
                id="budget"
                inputMode="numeric"
                value={budgetStr}
                onChange={(e) => {
                  const formatted = formatNumber(e.target.value);
                  setBudgetStr(formatted);
                  setState((s) => ({
                    ...s,
                    budget: parseInt(formatted.replace(/\./g, ""), 10) || 0,
                  }));
                }}
                placeholder="100.000"
                className="pl-12 h-14 text-xl font-bold rounded-2xl bg-white/50 dark:bg-zinc-900/50 border-orange-200/50 dark:border-zinc-800 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-orange-500/20 dark:focus:ring-orange-500/10 transition-all"
              />
            </div>
          </div>

          {/* Tujuan */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold tracking-wide text-foreground">
              Durasi & Tujuan Penggunaan
            </Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {(
                [
                  { id: "sekali", label: "Sekali Makan" },
                  { id: "harian", label: "Harian" },
                  { id: "bulanan", label: "Bulanan" },
                ] as { id: BudgetMode; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMode(opt.id)}
                  className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition-all duration-300 active:scale-95 cursor-pointer ${
                    state.mode === opt.id
                      ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "border-border bg-white/40 dark:bg-zinc-800/40 text-foreground hover:bg-white/80 dark:hover:bg-zinc-800/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {state.mode === "harian" && (
              <div className="mt-3 animate-fade-in">
                <Select
                  value={String(state.days)}
                  onValueChange={(v) => setState((s) => ({ ...s, days: parseInt(v, 10) }))}
                >
                  <SelectTrigger className="h-11 rounded-xl bg-white/50 dark:bg-zinc-900/50 border-orange-200/50 dark:border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-950 border border-border">
                    {DAY_OPTIONS.map((d) => (
                      <SelectItem key={d} value={String(d)}>
                        {d} hari
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Per unit calc */}
            {state.budget > 0 && (
              <div className="mt-4 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 px-5 py-4 transition-all duration-300 animate-slide-in">
                <div className="text-xs font-medium text-orange-600 dark:text-orange-400">
                  {state.mode === "sekali"
                    ? "Budget Per Kali Makan"
                    : `Budget Harian (Total Budget ÷ ${state.days} hari)`}
                </div>
                <div className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">
                  {formatRp(perUnit)}
                </div>
              </div>
            )}
          </div>

          {/* Criteria */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold tracking-wide text-foreground">
              Kriteria Tambahan{" "}
              <span className="text-muted-foreground font-normal">(opsional)</span>
            </Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {criteriaOptions.map((c) => {
                const active = state.criteria.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCriteria(c.id)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 cursor-pointer active:scale-95 ${
                      active
                        ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/10"
                        : "border-border bg-white/40 dark:bg-zinc-800/40 text-foreground hover:bg-white/80 dark:hover:bg-zinc-800/80"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={onSubmit}
            disabled={!state.budget}
            className="w-full h-14 text-base font-bold rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-600/30 transition-all duration-300 active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="h-5 w-5 mr-1" />
            Cari Rekomendasi Hemat
          </Button>
        </div>

        {/* Feature pills */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md px-5 py-4 text-sm font-semibold transition-all hover:bg-white/70 dark:hover:bg-zinc-800/70 shadow-xs">
            <div className="h-8 w-8 rounded-full bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
              <Utensils className="h-4 w-4 text-orange-500" />
            </div>
            <span>Rekomendasi Warung</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md px-5 py-4 text-sm font-semibold transition-all hover:bg-white/70 dark:hover:bg-zinc-800/70 shadow-xs">
            <div className="h-8 w-8 rounded-full bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
              <ChefHat className="h-4 w-4 text-orange-500" />
            </div>
            <span>Masak Hemat di Kos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
