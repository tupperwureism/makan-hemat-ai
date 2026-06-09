import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { WarungMap } from "@/components/WarungMap";
import { WarungCard } from "@/components/WarungCard";
import { RecipeCard } from "@/components/RecipeCard";
import { loadState, perDayBudget, type BudgetState } from "@/lib/budgetStore";
import { warungs, recipes, formatRp } from "@/lib/mockData";

export const Route = createFileRoute("/hasil")({
  head: () => ({
    meta: [
      { title: "Hasil Rekomendasi — WarungBudget AI" },
      { name: "description", content: "Rekomendasi warung dan resep sesuai budget kamu." },
    ],
  }),
  component: HasilPage,
});

function TabSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[250px] w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  );
}

function HasilPage() {
  const [state, setState] = useState<BudgetState | null>(null);
  const [tab, setTab] = useState("warung");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setState(loadState());
  }, []);

  const perDay = useMemo(() => (state ? perDayBudget(state) : 0), [state]);

  const handleTab = (v: string) => {
    setLoading(true);
    setTab(v);
    setTimeout(() => setLoading(false), 350);
  };

  if (!state) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center gap-3">
          <Link
            to="/"
            className="rounded-lg p-2 hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="text-xs text-muted-foreground">
              {state.mode === "sekali"
                ? "Budget per makan"
                : `Budget harian (${state.days} hari)`}
            </div>
            <div className="text-lg font-bold text-foreground">
              {formatRp(perDay)}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-5">
        <Tabs value={tab} onValueChange={handleTab}>
          <TabsList className="w-full grid grid-cols-3 h-auto">
            <TabsTrigger value="warung" className="py-2.5">
              Warung Terdekat
            </TabsTrigger>
            <TabsTrigger value="masak" className="py-2.5">
              Masak di Kos
            </TabsTrigger>
            <TabsTrigger value="rencana" className="py-2.5">
              Rencana Makan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="warung" className="mt-5">
            {loading ? (
              <TabSkeleton />
            ) : (
              <div className="space-y-4">
                <WarungMap warungs={warungs} />
                <div className="space-y-3">
                  {warungs.map((w) => (
                    <WarungCard key={w.id} warung={w} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="masak" className="mt-5">
            {loading ? <TabSkeleton /> : <MasakTab days={state.days} />}
          </TabsContent>

          <TabsContent value="rencana" className="mt-5">
            {loading ? <TabSkeleton /> : <RencanaTab state={state} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MasakTab({ days }: { days: number }) {
  // Aggregate ingredients across recipes for stok belanja
  const stok = useMemo(() => {
    const map = new Map<string, { qty: number; total: number }>();
    // Each recipe cooked ~ days/recipes.length times (rotation)
    const rotations = Math.max(1, Math.ceil(days / recipes.length));
    recipes.forEach((r) => {
      r.ingredients.forEach((ing) => {
        const cur = map.get(ing.name) ?? { qty: 0, total: 0 };
        cur.qty += rotations;
        cur.total += ing.price * rotations;
        map.set(ing.name, cur);
      });
    });
    return Array.from(map.entries()).map(([name, v]) => ({ name, ...v }));
  }, [days]);

  const schedule = useMemo(() => {
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      recipe: recipes[i % recipes.length],
    }));
  }, [days]);

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h3 className="font-semibold text-base text-foreground">
          Stok belanja untuk {days} hari
        </h3>
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr className="text-left">
                <th className="px-3 py-2 font-medium">Bahan</th>
                <th className="px-3 py-2 font-medium text-center">Jumlah</th>
                <th className="px-3 py-2 font-medium text-right">Estimasi</th>
              </tr>
            </thead>
            <tbody>
              {stok.map((s) => (
                <tr key={s.name} className="border-t border-border">
                  <td className="px-3 py-2">{s.name}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">
                    {s.qty}x
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {formatRp(s.total)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-border bg-primary-soft">
                <td className="px-3 py-2 font-semibold" colSpan={2}>
                  Total belanja
                </td>
                <td className="px-3 py-2 text-right font-bold text-accent-foreground">
                  {formatRp(stok.reduce((a, b) => a + b.total, 0))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h3 className="font-semibold text-base text-foreground">
          Jadwal masak ({days} hari)
        </h3>
        <div className="mt-3 space-y-2 max-h-72 overflow-auto pr-1">
          {schedule.map((s) => (
            <div
              key={s.day}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
            >
              <span className="font-medium">Hari {s.day}</span>
              <span className="text-muted-foreground">{s.recipe.name}</span>
              <span className="font-semibold">{formatRp(s.recipe.total)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RencanaTab({ state }: { state: BudgetState }) {
  const days = state.days;
  const totalBudget = state.budget;

  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const plan = useMemo(() => {
    return Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      const sarapan = warungs[day % warungs.length].menu[1];
      const siang = warungs[(day + 1) % warungs.length].menu[0];
      const malam = recipes[day % recipes.length];
      const subtotal = sarapan.price + siang.price + malam.total;
      return {
        day,
        dayName: dayNames[i % 7],
        sarapan: { name: sarapan.name, price: sarapan.price, place: warungs[day % warungs.length].name },
        siang: { name: siang.name, price: siang.price, place: warungs[(day + 1) % warungs.length].name },
        malam: { name: malam.name, price: malam.total, place: "Masak di Kos" },
        subtotal,
      };
    });
  }, [days]);

  const totalSpent = plan.reduce((a, b) => a + b.subtotal, 0);
  const pct = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-xs text-muted-foreground">Total estimasi</div>
            <div className="text-xl font-bold text-foreground">
              {formatRp(totalSpent)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Budget</div>
            <div className="text-sm font-semibold text-foreground">
              {formatRp(totalBudget)}
            </div>
          </div>
        </div>
        <Progress value={pct} className="h-2" />
        <div className="mt-1.5 text-xs text-muted-foreground">
          {pct <= 100
            ? `Terpakai ${pct.toFixed(0)}% dari budget`
            : `Over budget ${(pct - 100).toFixed(0)}%`}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {plan.map((d) => (
          <div
            key={d.day}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {d.dayName}
                </div>
                <h4 className="font-semibold leading-tight">Hari {d.day}</h4>
              </div>
              <span className="text-sm font-bold text-primary">
                {formatRp(d.subtotal)}
              </span>
            </div>
            <div className="grid gap-2 text-sm">
              {[
                { label: "Sarapan", item: d.sarapan },
                { label: "Makan Siang", item: d.siang },
                { label: "Makan Malam", item: d.malam },
              ].map(({ label, item }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-2 rounded-lg bg-secondary px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {label}
                    </div>
                    <div className="font-medium text-foreground truncate">{item.name}</div>
                  </div>
                  <div className="font-semibold text-foreground shrink-0">
                    {formatRp(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
