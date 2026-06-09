import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { Sparkles, Utensils, ChefHat } from "lucide-react";
import {
  defaultState,
  loadState,
  saveState,
  type BudgetMode,
  perDayBudget,
} from "@/lib/budgetStore";
import { criteriaOptions, formatRp } from "@/lib/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WarungBudget AI — Makan Hemat, Gizi Tetap Terjaga" },
      {
        name: "description",
        content:
          "Atur budget makan mahasiswa: rekomendasi warung terdekat dan resep masak di kos.",
      },
      { property: "og:title", content: "WarungBudget AI" },
      {
        property: "og:description",
        content: "Makan Hemat, Gizi Tetap Terjaga",
      },
    ],
  }),
  component: BudgetInput,
});

const DAY_OPTIONS = [1, 2, 3, 7, 14, 30];

function formatNumber(n: string) {
  const digits = n.replace(/\D/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("id-ID");
}

function BudgetInput() {
  const navigate = useNavigate();
  const [state, setState] = useState(defaultState);
  const [budgetStr, setBudgetStr] = useState("");

  useEffect(() => {
    const s = loadState();
    setState(s);
    setBudgetStr(s.budget ? s.budget.toLocaleString("id-ID") : "");
  }, []);

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
      criteria: s.criteria.includes(id)
        ? s.criteria.filter((c) => c !== id)
        : [...s.criteria, id],
    }));
  };

  const perUnit = useMemo(() => perDayBudget(state), [state]);

  const onSubmit = () => {
    saveState(state);
    navigate({ to: "/hasil" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-accent-foreground mb-3">
            <Sparkles className="h-3.5 w-3.5" /> AI Powered
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Warung<span className="text-primary">Budget</span> AI
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Makan Hemat, Gizi Tetap Terjaga
          </p>
        </header>

        {/* Card */}
        <div className="rounded-3xl border border-border bg-card shadow-lg p-5 sm:p-6 space-y-6">
          {/* Budget */}
          <div>
            <Label htmlFor="budget" className="text-sm font-medium">
              Budget kamu
            </Label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
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
                className="pl-10 h-12 text-lg font-semibold"
              />
            </div>
          </div>

          {/* Tujuan */}
          <div>
            <Label className="text-sm font-medium">Tujuan penggunaan</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  { id: "sekali", label: "Sekali makan" },
                  { id: "harian", label: "Harian" },
                  { id: "bulanan", label: "Bulanan" },
                ] as { id: BudgetMode; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMode(opt.id)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    state.mode === opt.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-secondary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {state.mode === "harian" && (
              <div className="mt-3">
                <Select
                  value={String(state.days)}
                  onValueChange={(v) =>
                    setState((s) => ({ ...s, days: parseInt(v, 10) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              <div className="mt-3 rounded-xl bg-primary-soft px-4 py-3">
                <div className="text-xs text-accent-foreground/80">
                  {state.mode === "sekali"
                    ? "Budget per makan"
                    : `Budget per hari (÷ ${state.days} hari)`}
                </div>
                <div className="text-lg font-bold text-accent-foreground">
                  {formatRp(perUnit)}
                </div>
              </div>
            )}
          </div>

          {/* Criteria */}
          <div>
            <Label className="text-sm font-medium">
              Kriteria tambahan{" "}
              <span className="text-muted-foreground font-normal">(opsional)</span>
            </Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {criteriaOptions.map((c) => {
                const active = state.criteria.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCriteria(c.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:bg-secondary"
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
            className="w-full h-12 text-base font-semibold rounded-xl"
          >
            <Sparkles className="h-4 w-4" />
            Cari Rekomendasi
          </Button>
        </div>

        {/* Feature pills */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium">
            <Utensils className="h-4 w-4 text-primary" /> 🍜 Rekomendasi Warung
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium">
            <ChefHat className="h-4 w-4 text-primary" /> 🍳 Masak di Kos
          </div>
        </div>
      </div>
    </div>
  );
}
