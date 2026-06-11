import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Flame,
  Dumbbell,
  Search,
  SlidersHorizontal,
  Clock,
  BookOpen,
  UtensilsCrossed,
  CheckCircle,
  AlertTriangle,
  Moon,
  Sun,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WarungMap } from "@/components/WarungMap";
import { loadState, perDayBudget, type BudgetState } from "@/lib/budgetStore";
import { formatRp } from "@/lib/mockData";
import { getWarungs, getRecipes } from "@/lib/api";

export const Route = createFileRoute("/v2/hasil")({
  head: () => ({
    meta: [
      { title: "Hasil Rekomendasi v2 — WarungBudget AI" },
      {
        name: "description",
        content: "Rekomendasi warung & resep terupdate dengan database dinamis.",
      },
    ],
  }),
  component: HasilPageV2,
});

function TabSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[250px] w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  );
}

function HasilPageV2() {
  const [state, setState] = useState<BudgetState | null>(null);
  const [tab, setTab] = useState("warung");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Dynamic Data States
  const [warungsList, setWarungsList] = useState<any[]>([]);
  const [recipesList, setRecipesList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [minProtein, setMinProtein] = useState<number>(0);

  // Modal State for Recipe Detail
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  useEffect(() => {
    // Dark mode check
    const isDarkStored = localStorage.getItem("theme") === "dark";
    setIsDark(isDarkStored);
    if (isDarkStored) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setState(loadState());

    // Fetch dynamic database data from server functions
    async function loadDbData() {
      try {
        const [w, r] = await Promise.all([getWarungs(), getRecipes()]);
        setWarungsList(w);
        setRecipesList(r);
      } catch (err) {
        console.error("Failed to load db data", err);
      } finally {
        setLoadingData(false);
      }
    }
    loadDbData();
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

  const perDay = useMemo(() => (state ? perDayBudget(state) : 0), [state]);

  const handleTab = (v: string) => {
    setLoading(true);
    setTab(v);
    setTimeout(() => setLoading(false), 350);
  };

  // Filtered Warungs
  const filteredWarungs = useMemo(() => {
    return warungsList.filter((w) => {
      // Search matches warung name or menu items
      const matchesSearch =
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.menu.some((m: any) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

      // Matches price (at least one menu item below or equal to maxPrice)
      const hasAffordableMenu = w.menu.some((m: any) => m.price <= maxPrice);

      // Matches protein criteria
      const matchesProtein = w.protein >= minProtein;

      return matchesSearch && hasAffordableMenu && matchesProtein;
    });
  }, [warungsList, searchQuery, maxPrice, minProtein]);

  if (!state || loadingData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
        <Skeleton className="h-14 w-full max-w-2xl rounded-2xl" />
        <Skeleton className="h-[400px] w-full max-w-2xl rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50/50 to-orange-100/20 dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300 pb-16 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-400/10 dark:bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-amber-400/10 dark:bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-border transition-all">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/v2"
              className="rounded-xl p-2 hover:bg-orange-500/10 dark:hover:bg-zinc-800 transition-all active:scale-95 border border-border"
            >
              <ArrowLeft className="h-4 w-4 text-foreground" />
            </Link>
            <div>
              <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {state.mode === "sekali"
                  ? "Budget Per Kali Makan"
                  : `Budget Harian (${state.days} hari)`}
              </div>
              <div className="text-base sm:text-xl font-black text-orange-500">
                {formatRp(perDay)}
              </div>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md border border-border hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all active:scale-95"
            title="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-700" />
            )}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6 relative z-10">
        <Tabs value={tab} onValueChange={handleTab}>
          <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-white/55 dark:bg-zinc-900/55 border border-border rounded-2xl glass-panel">
            <TabsTrigger
              value="warung"
              className="py-2.5 font-bold rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all cursor-pointer"
            >
              Warung Makan
            </TabsTrigger>
            <TabsTrigger
              value="masak"
              className="py-2.5 font-bold rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all cursor-pointer"
            >
              Masak di Kos
            </TabsTrigger>
            <TabsTrigger
              value="rencana"
              className="py-2.5 font-bold rounded-xl data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all cursor-pointer"
            >
              Rencana Makan
            </TabsTrigger>
          </TabsList>

          {/* TAB: WARUNG TERDEKAT */}
          <TabsContent value="warung" className="mt-6 space-y-5">
            {loading ? (
              <TabSkeleton />
            ) : (
              <div className="space-y-4">
                {/* Interactive Map */}
                <div className="overflow-hidden rounded-2xl shadow-lg border border-border">
                  <WarungMap warungs={filteredWarungs} />
                </div>

                {/* Filter Controls Panel */}
                <div className="glass-card rounded-2xl p-4 border space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <SlidersHorizontal className="h-4 w-4 text-orange-500" />
                    <span>Filter & Cari Warung</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Cari warung atau menu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 rounded-xl bg-white/40 dark:bg-zinc-900/40 border-border"
                      />
                    </div>

                    {/* Price Filter Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        Harga menu ≤
                      </span>
                      <select
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                        className="h-10 w-full rounded-xl bg-white/40 dark:bg-zinc-900/40 border border-border text-sm px-3 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value={10000} className="dark:bg-zinc-900">
                          Rp 10.000
                        </option>
                        <option value={12000} className="dark:bg-zinc-900">
                          Rp 12.000
                        </option>
                        <option value={15000} className="dark:bg-zinc-900">
                          Rp 15.000
                        </option>
                        <option value={20000} className="dark:bg-zinc-900">
                          Rp 20.000
                        </option>
                        <option value={30000} className="dark:bg-zinc-900">
                          Rp 30.000
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Protein Quick Filter */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Kandungan Protein:
                    </span>
                    <div className="flex gap-2">
                      {[0, 22, 28].map((prot) => (
                        <button
                          key={prot}
                          onClick={() => setMinProtein(prot)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition active:scale-95 cursor-pointer border ${
                            minProtein === prot
                              ? "bg-orange-500 border-orange-500 text-white"
                              : "bg-white/40 dark:bg-zinc-800/40 border-border hover:bg-white/70"
                          }`}
                        >
                          {prot === 0 ? "Semua" : `≥ ${prot}g`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* List of Warungs */}
                <div className="space-y-4">
                  {filteredWarungs.length === 0 ? (
                    <div className="text-center py-12 glass-card rounded-2xl border">
                      <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2 animate-bounce" />
                      <p className="font-bold text-foreground">Tidak Ada Warung yang Cocok</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Coba sesuaikan pencarian atau tingkatkan batas harga menu Anda.
                      </p>
                    </div>
                  ) : (
                    filteredWarungs.map((w) => (
                      <div
                        key={w.id}
                        className="glass-card rounded-2xl p-5 border shadow-xs transition-all hover:scale-[1.01] hover:shadow-md space-y-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-foreground">{w.name}</h3>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1 font-semibold text-amber-500">
                                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                {w.rating}
                              </span>
                              <span className="flex items-center gap-1 font-medium">
                                <MapPin className="h-3.5 w-3.5 text-orange-500" />
                                {w.distance}m
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full border border-orange-500/20">
                            Terdekat
                          </span>
                        </div>

                        {/* Menu list */}
                        <div className="bg-white/30 dark:bg-zinc-900/30 rounded-xl p-3 border border-border/50 space-y-2">
                          {w.menu.map((m: any) => (
                            <div
                              key={m.name}
                              className="flex justify-between items-center text-sm pb-1.5 border-b border-dashed border-border last:border-0 last:pb-0"
                            >
                              <span className="text-foreground font-medium">{m.name}</span>
                              <span className="font-bold text-orange-600 dark:text-orange-400">
                                {formatRp(m.price)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Nutrition info */}
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div className="bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 rounded-xl py-2 px-3">
                            <span className="flex items-center justify-center gap-1 text-orange-600 dark:text-orange-400 font-bold mb-0.5">
                              <Flame className="h-3.5 w-3.5" /> Kalori
                            </span>
                            <span className="font-black text-foreground">{w.kalori} kkal</span>
                          </div>
                          <div className="bg-zinc-500/10 dark:bg-zinc-500/20 border border-border rounded-xl py-2 px-3">
                            <span className="flex items-center justify-center gap-1 text-muted-foreground dark:text-zinc-400 font-bold mb-0.5">
                              <Dumbbell className="h-3.5 w-3.5" /> Protein
                            </span>
                            <span className="font-black text-foreground">{w.protein}g</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* TAB: MASAK DI KOS */}
          <TabsContent value="masak" className="mt-6 space-y-6">
            {loading ? (
              <TabSkeleton />
            ) : (
              <div className="space-y-6">
                {/* List of Recipes */}
                <div className="space-y-4 animate-fade-in">
                  {recipesList.map((r) => (
                    <div
                      key={r.id}
                      className="glass-card rounded-2xl p-5 border shadow-xs transition-all hover:scale-[1.01] hover:shadow-md space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-foreground">{r.name}</h3>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 font-semibold text-orange-500">
                              <Clock className="h-3.5 w-3.5" />
                              {r.prepTime || 10} menit
                            </span>
                            <span className="flex items-center gap-1 font-medium bg-zinc-500/10 dark:bg-zinc-500/20 px-2 py-0.5 rounded-md">
                              {r.difficulty || "Mudah"}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setSelectedRecipe(r)}
                          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold px-3 py-1 cursor-pointer"
                        >
                          <BookOpen className="h-3.5 w-3.5 mr-1" /> Langkah Masak
                        </Button>
                      </div>

                      {/* Ingredients */}
                      <div className="bg-white/30 dark:bg-zinc-900/30 rounded-xl p-3 border border-border/50 space-y-2">
                        {r.ingredients.map((ing: any) => (
                          <div
                            key={ing.name}
                            className="flex justify-between items-center text-sm pb-1.5 border-b border-dashed border-border last:border-0 last:pb-0"
                          >
                            <span className="text-foreground font-medium">{ing.name}</span>
                            <span className="text-muted-foreground font-semibold">
                              {formatRp(ing.price)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total cost and nutrition */}
                      <div className="flex justify-between items-center border-t border-border pt-3">
                        <div className="flex gap-2">
                          <span className="text-xs bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-lg font-bold flex items-center gap-0.5">
                            <Flame className="h-3 w-3" /> {r.kalori} kkal
                          </span>
                          <span className="text-xs bg-zinc-500/10 dark:bg-zinc-500/20 text-foreground px-2.5 py-1 rounded-lg font-bold flex items-center gap-0.5">
                            <Dumbbell className="h-3 w-3" /> {r.protein}g protein
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground block">Total Bahan</span>
                          <span className="font-black text-lg text-orange-500">
                            {formatRp(r.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stock shopping aggregate */}
                <section className="glass-card rounded-2xl p-5 border space-y-4">
                  <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                    <UtensilsCrossed className="h-4.5 w-4.5 text-orange-500" />
                    <span>Daftar Belanja Bahan untuk {state.days} Hari</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Estimasi belanja bahan mentah jika merotasi menu masakan kos selama {state.days}{" "}
                    hari.
                  </p>

                  <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-orange-500/10 dark:bg-zinc-900 text-foreground">
                        <tr className="text-left font-semibold">
                          <th className="px-4 py-3">Bahan Makanan</th>
                          <th className="px-4 py-3 text-center">Jumlah</th>
                          <th className="px-4 py-3 text-right">Estimasi Harga</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const map = new Map<string, { qty: number; total: number }>();
                          const rotations = Math.max(1, Math.ceil(state.days / recipesList.length));
                          recipesList.forEach((r) => {
                            r.ingredients.forEach((ing: any) => {
                              const cur = map.get(ing.name) ?? { qty: 0, total: 0 };
                              cur.qty += rotations;
                              cur.total += ing.price * rotations;
                              map.set(ing.name, cur);
                            });
                          });
                          const stok = Array.from(map.entries()).map(([name, v]) => ({
                            name,
                            ...v,
                          }));

                          return (
                            <>
                              {stok.map((s) => (
                                <tr
                                  key={s.name}
                                  className="border-t border-border bg-white/20 dark:bg-zinc-950/20"
                                >
                                  <td className="px-4 py-3 font-medium">{s.name}</td>
                                  <td className="px-4 py-3 text-center text-muted-foreground font-semibold">
                                    {s.qty}x
                                  </td>
                                  <td className="px-4 py-3 text-right font-bold text-foreground">
                                    {formatRp(s.total)}
                                  </td>
                                </tr>
                              ))}
                              <tr className="border-t border-border bg-orange-500/10 dark:bg-orange-500/20 font-bold">
                                <td className="px-4 py-3 font-extrabold" colSpan={2}>
                                  Total Estimasi Belanja
                                </td>
                                <td className="px-4 py-3 text-right font-black text-orange-600 dark:text-orange-400">
                                  {formatRp(stok.reduce((a, b) => a + b.total, 0))}
                                </td>
                              </tr>
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Schedule list */}
                <section className="glass-card rounded-2xl p-5 border space-y-4">
                  <h3 className="font-bold text-base text-foreground">
                    Jadwal Masak Kos ({state.days} Hari)
                  </h3>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {Array.from({ length: state.days }, (_, i) => {
                      const day = i + 1;
                      const recipe = recipesList[i % recipesList.length];
                      if (!recipe) return null;
                      return (
                        <div
                          key={day}
                          className="flex items-center justify-between rounded-xl border border-border/80 bg-white/30 dark:bg-zinc-900/30 px-4 py-3 text-sm"
                        >
                          <span className="font-bold text-foreground">Hari {day}</span>
                          <span className="text-muted-foreground font-medium">{recipe.name}</span>
                          <span className="font-bold text-orange-500">
                            {formatRp(recipe.total)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}
          </TabsContent>

          {/* TAB: RENCANA MAKAN */}
          <TabsContent value="rencana" className="mt-6 space-y-5">
            {loading ? (
              <TabSkeleton />
            ) : (
              <div className="space-y-4">
                {/* Budget Summary Card */}
                {(() => {
                  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                  const plan = Array.from({ length: state.days }, (_, i) => {
                    const day = i + 1;
                    const warungIndex = day % (warungsList.length || 1);
                    const warungIndex2 = (day + 1) % (warungsList.length || 1);
                    const recipeIndex = day % (recipesList.length || 1);

                    const currentWarung1 = warungsList[warungIndex];
                    const currentWarung2 = warungsList[warungIndex2];
                    const currentRecipe = recipesList[recipeIndex];

                    const sarapan = currentWarung1?.menu[1] || { name: "Nasi Sayur", price: 8000 };
                    const siang = currentWarung2?.menu[0] || { name: "Nasi + Ayam", price: 13000 };
                    const malam = currentRecipe || { name: "Mie Goreng Telur", total: 8500 };

                    const subtotal =
                      sarapan.price + siang.price + (malam.total || malam.price || 0);

                    return {
                      day,
                      dayName: dayNames[i % 7],
                      sarapan: {
                        name: sarapan.name,
                        price: sarapan.price,
                        place: currentWarung1?.name || "Warung Makan",
                      },
                      siang: {
                        name: siang.name,
                        price: siang.price,
                        place: currentWarung2?.name || "Warung Makan",
                      },
                      malam: {
                        name: malam.name,
                        price: malam.total || malam.price || 0,
                        place: "Masak di Kos",
                      },
                      subtotal,
                    };
                  });

                  const totalSpent = plan.reduce((a, b) => a + b.subtotal, 0);
                  const totalBudget = state.budget;
                  const pct = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;
                  const overBudget = totalSpent > totalBudget;

                  return (
                    <>
                      <div className="glass-card rounded-2xl p-5 border space-y-3">
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">
                              Total Pengeluaran Rencana
                            </span>
                            <span className="text-2xl font-black text-foreground">
                              {formatRp(totalSpent)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">
                              Budget Anda
                            </span>
                            <span className="text-sm font-extrabold text-foreground">
                              {formatRp(totalBudget)}
                            </span>
                          </div>
                        </div>

                        <Progress
                          value={pct}
                          className={`h-2.5 rounded-full ${overBudget ? "bg-red-500/20" : "bg-orange-500/20"}`}
                        />

                        <div className="flex justify-between items-center text-xs font-bold mt-1">
                          <span className={overBudget ? "text-red-500" : "text-orange-500"}>
                            Terpakai {pct.toFixed(0)}% dari budget
                          </span>
                          {overBudget && (
                            <span className="text-red-500 flex items-center gap-0.5">
                              <AlertTriangle className="h-3 w-3" /> Over budget{" "}
                              {formatRp(totalSpent - totalBudget)}!
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Daily detail grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {plan.map((d) => (
                          <div
                            key={d.day}
                            className="glass-card rounded-2xl p-5 border flex flex-col justify-between space-y-4"
                          >
                            <div className="flex justify-between items-center border-b border-border/50 pb-2">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                  {d.dayName}
                                </span>
                                <h4 className="font-extrabold text-base text-foreground leading-none mt-0.5">
                                  Hari {d.day}
                                </h4>
                              </div>
                              <span className="text-sm font-black text-orange-500">
                                {formatRp(d.subtotal)}
                              </span>
                            </div>

                            <div className="space-y-3">
                              {[
                                { label: "Sarapan", item: d.sarapan },
                                { label: "Makan Siang", item: d.siang },
                                { label: "Makan Malam", item: d.malam },
                              ].map(({ label, item }) => (
                                <div
                                  key={label}
                                  className="rounded-xl bg-white/30 dark:bg-zinc-900/30 border border-border/50 p-2.5 flex justify-between items-center text-xs"
                                >
                                  <div>
                                    <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                                      {label} ({item.place})
                                    </span>
                                    <span className="font-semibold text-foreground mt-0.5 block truncate max-w-[150px]">
                                      {item.name}
                                    </span>
                                  </div>
                                  <span className="font-bold text-foreground shrink-0 bg-white/50 dark:bg-zinc-800/50 px-2 py-1 rounded-md">
                                    {formatRp(item.price)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Dialog for Recipe Cooking Instructions */}
      <Dialog open={selectedRecipe !== null} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-950 border border-border rounded-3xl p-6 shadow-2xl glass-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-foreground">
              Detail Resep: {selectedRecipe?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Ikuti instruksi langkah memasak hemat di kos berikut ini.
            </DialogDescription>
          </DialogHeader>

          {selectedRecipe && (
            <div className="space-y-5 mt-4 overflow-y-auto max-h-[70vh] pr-1">
              {/* Recipe Meta */}
              <div className="flex justify-between items-center p-3 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 text-xs font-bold">
                <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                  <Clock className="h-4 w-4" /> Waktu: {selectedRecipe.prepTime} mnt
                </span>
                <span className="text-foreground">Kesulitan: {selectedRecipe.difficulty}</span>
              </div>

              {/* Tools needed */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Peralatan yang Dibutuhkan
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRecipe.tools?.map((tool: string) => (
                    <span
                      key={tool}
                      className="text-xs bg-zinc-500/10 dark:bg-zinc-500/20 px-3 py-1 rounded-lg font-semibold text-foreground border border-border"
                    >
                      🍳 {tool}
                    </span>
                  )) || <span className="text-xs text-muted-foreground">Alat standar kos</span>}
                </div>
              </div>

              {/* Ingredients */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Bahan & Harga
                </span>
                <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
                  {selectedRecipe.ingredients.map((ing: any) => (
                    <div
                      key={ing.name}
                      className="flex justify-between p-2.5 text-xs bg-white/20 dark:bg-zinc-900/20"
                    >
                      <span className="font-medium text-foreground">{ing.name}</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">
                        {formatRp(ing.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking Steps */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Langkah-Langkah Memasak
                </span>
                <div className="space-y-3">
                  {selectedRecipe.steps?.map((step: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-white/40 dark:bg-zinc-900/40 p-3 rounded-2xl border border-border/80"
                    >
                      <span className="h-6 w-6 rounded-full bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-medium text-foreground leading-relaxed pt-0.5">
                        {step}
                      </p>
                    </div>
                  )) || (
                    <p className="text-xs text-muted-foreground italic">
                      Langkah memasak belum diatur.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => setSelectedRecipe(null)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold cursor-pointer"
                >
                  <CheckCircle className="h-4 w-4 mr-1.5" /> Selesai & Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
