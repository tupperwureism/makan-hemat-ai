import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Moon,
  Sun,
  Utensils,
  ChefHat,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
// native select used instead of Radix UI select to prevent SSR hydration mismatches
import {
  getWarungs,
  getRecipes,
  addWarung,
  addRecipe,
  deleteWarung,
  deleteRecipe,
} from "@/lib/api";
import { formatRp } from "@/lib/mockData";

export const Route = createFileRoute("/v2/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel v2 — WarungBudget AI" },
      { name: "description", content: "Kelola database warung dan resep secara dinamis." },
    ],
  }),
  component: AdminPageV2,
});

function AdminPageV2() {
  const [isDark, setIsDark] = useState(false);
  const [warungsList, setWarungsList] = useState<any[]>([]);
  const [recipesList, setRecipesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Forms Toggle
  const [showWarungForm, setShowWarungForm] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);

  // New Warung Form State
  const [warungName, setWarungName] = useState("");
  const [warungRating, setWarungRating] = useState(4.5);
  const [warungDistance, setWarungDistance] = useState(200);
  const [warungKalori, setWarungKalori] = useState(600);
  const [warungProtein, setWarungProtein] = useState(25);
  const [warungMenu, setWarungMenu] = useState<{ name: string; price: number }[]>([
    { name: "Nasi + Lauk Pilihan", price: 12000 },
  ]);

  // New Recipe Form State
  const [recipeName, setRecipeName] = useState("");
  const [recipeKalori, setRecipeKalori] = useState(400);
  const [recipeProtein, setRecipeProtein] = useState(15);
  const [recipePrepTime, setRecipePrepTime] = useState(10);
  const [recipeDifficulty, setRecipeDifficulty] = useState("Mudah");
  const [recipeTools, setRecipeTools] = useState("Wajan, Spatula");
  const [recipeIngredients, setRecipeIngredients] = useState<{ name: string; price: number }[]>([
    { name: "Bahan Utama", price: 5000 },
  ]);
  const [recipeSteps, setRecipeSteps] = useState<string[]>(["Langkah pertama..."]);

  useEffect(() => {
    // Dark mode
    const isDarkStored = localStorage.getItem("theme") === "dark";
    setIsDark(isDarkStored);
    if (isDarkStored) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    loadData();
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

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  async function loadData() {
    setLoading(true);
    try {
      const [w, r] = await Promise.all([getWarungs(), getRecipes()]);
      setWarungsList(w);
      setRecipesList(r);
    } catch (e) {
      showMsg("Gagal memuat data dari server.", "error");
    } finally {
      setLoading(false);
    }
  }

  // Handle Warung Submissions
  const handleAddMenuRow = () => {
    setWarungMenu([...warungMenu, { name: "", price: 10000 }]);
  };

  const handleRemoveMenuRow = (idx: number) => {
    setWarungMenu(warungMenu.filter((_, i) => i !== idx));
  };

  const handleMenuChange = (idx: number, field: "name" | "price", val: any) => {
    const updated = [...warungMenu];
    if (field === "price") {
      updated[idx].price = parseInt(val, 10) || 0;
    } else {
      updated[idx].name = val;
    }
    setWarungMenu(updated);
  };

  const handleSubmitWarung = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warungName || warungMenu.some((m) => !m.name || m.price <= 0)) {
      showMsg("Harap isi nama warung dan menu dengan benar.", "error");
      return;
    }

    try {
      // Coordinates randomized around Tembalang center
      const lat = -7.0527 + (Math.random() - 0.5) * 0.006;
      const lng = 110.4377 + (Math.random() - 0.5) * 0.006;

      await addWarung({
        data: {
          name: warungName,
          rating: warungRating,
          distance: warungDistance,
          menu: warungMenu,
          kalori: warungKalori,
          protein: warungProtein,
          lat,
          lng,
        },
      });

      showMsg(`Warung ${warungName} berhasil ditambahkan!`, "success");
      // Reset form
      setWarungName("");
      setWarungMenu([{ name: "Nasi + Lauk Pilihan", price: 12000 }]);
      setShowWarungForm(false);
      loadData();
    } catch (err) {
      showMsg("Gagal menambah warung ke database.", "error");
    }
  };

  const handleDeleteWarung = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus warung ini?")) return;
    try {
      await deleteWarung({ data: { id } });
      showMsg("Warung berhasil dihapus.", "success");
      loadData();
    } catch (err) {
      showMsg("Gagal menghapus warung.", "error");
    }
  };

  // Handle Recipe Submissions
  const handleAddIngredientRow = () => {
    setRecipeIngredients([...recipeIngredients, { name: "", price: 2000 }]);
  };

  const handleRemoveIngredientRow = (idx: number) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== idx));
  };

  const handleIngredientChange = (idx: number, field: "name" | "price", val: any) => {
    const updated = [...recipeIngredients];
    if (field === "price") {
      updated[idx].price = parseInt(val, 10) || 0;
    } else {
      updated[idx].name = val;
    }
    setRecipeIngredients(updated);
  };

  const handleAddStepRow = () => {
    setRecipeSteps([...recipeSteps, ""]);
  };

  const handleRemoveStepRow = (idx: number) => {
    setRecipeSteps(recipeSteps.filter((_, i) => i !== idx));
  };

  const handleStepChange = (idx: number, val: string) => {
    const updated = [...recipeSteps];
    updated[idx] = val;
    setRecipeSteps(updated);
  };

  const handleSubmitRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !recipeName ||
      recipeIngredients.some((i) => !i.name || i.price <= 0) ||
      recipeSteps.some((s) => !s)
    ) {
      showMsg("Harap isi nama resep, bahan, dan langkah masak dengan benar.", "error");
      return;
    }

    const totalCost = recipeIngredients.reduce((sum, ing) => sum + ing.price, 0);

    try {
      await addRecipe({
        data: {
          name: recipeName,
          ingredients: recipeIngredients,
          total: totalCost,
          kalori: recipeKalori,
          protein: recipeProtein,
          prepTime: recipePrepTime,
          difficulty: recipeDifficulty,
          tools: recipeTools.split(",").map((t) => t.trim()),
          steps: recipeSteps,
        },
      });

      showMsg(`Resep ${recipeName} berhasil ditambahkan!`, "success");
      // Reset form
      setRecipeName("");
      setRecipeIngredients([{ name: "Bahan Utama", price: 5000 }]);
      setRecipeSteps(["Langkah pertama..."]);
      setShowRecipeForm(false);
      loadData();
    } catch (err) {
      showMsg("Gagal menambah resep ke database.", "error");
    }
  };

  const handleDeleteRecipe = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus resep ini?")) return;
    try {
      await deleteRecipe({ data: { id } });
      showMsg("Resep berhasil dihapus.", "success");
      loadData();
    } catch (err) {
      showMsg("Gagal menghapus resep.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-blue-100/20 dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300 pb-16 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] bg-amber-400/10 dark:bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-b border-border transition-all">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/v2"
              className="rounded-xl p-2 hover:bg-blue-500/10 dark:hover:bg-zinc-800 transition-all active:scale-95 border border-border"
            >
              <ArrowLeft className="h-4 w-4 text-foreground" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-black text-foreground">
                Admin Database Panel
              </h1>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                Kelola Warung & Resep v2
              </p>
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

      {/* Notifications/Feedback Toast */}
      {message && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <div
            className={`flex items-center gap-2 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-semibold backdrop-blur-md ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-8 relative z-10 space-y-8">
        {loading ? (
          <div className="text-center py-16 space-y-3">
            <Skeleton className="h-10 w-full max-w-md mx-auto rounded-xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* COLUMN 1: KELOLA WARUNG MAKAN */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/40 dark:bg-zinc-800/40 border border-border p-4 rounded-2xl glass-panel">
                <div className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-blue-500" />
                  <h2 className="font-extrabold text-base">Daftar Warung ({warungsList.length})</h2>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowWarungForm(!showWarungForm)}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {showWarungForm ? (
                    <X className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 mr-1" />
                  )}
                  {showWarungForm ? "Batal" : "Tambah"}
                </Button>
              </div>

              {/* Form Add Warung */}
              {showWarungForm && (
                <form
                  onSubmit={handleSubmitWarung}
                  className="glass-card rounded-2xl p-5 border shadow-xl space-y-4 animate-fade-in"
                >
                  <h3 className="font-bold text-sm text-foreground">Form Tambah Warung Baru</h3>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Nama Warung</Label>
                    <Input
                      type="text"
                      placeholder="Warteg Asri / Warung Sederhana"
                      value={warungName}
                      onChange={(e) => setWarungName(e.target.value)}
                      className="bg-white/40 dark:bg-zinc-900/40 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Rating (0 - 5)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={warungRating}
                        onChange={(e) => setWarungRating(parseFloat(e.target.value) || 0)}
                        className="bg-white/40 dark:bg-zinc-900/40 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Jarak (meter)</Label>
                      <Input
                        type="number"
                        value={warungDistance}
                        onChange={(e) => setWarungDistance(parseInt(e.target.value, 10) || 0)}
                        className="bg-white/40 dark:bg-zinc-900/40 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Kalori Menu (kkal)</Label>
                      <Input
                        type="number"
                        value={warungKalori}
                        onChange={(e) => setWarungKalori(parseInt(e.target.value, 10) || 0)}
                        className="bg-white/40 dark:bg-zinc-900/40 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Protein Menu (g)</Label>
                      <Input
                        type="number"
                        value={warungProtein}
                        onChange={(e) => setWarungProtein(parseInt(e.target.value, 10) || 0)}
                        className="bg-white/40 dark:bg-zinc-900/40 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-bold">Daftar Menu & Harga</Label>
                      <button
                        type="button"
                        onClick={handleAddMenuRow}
                        className="text-xs font-bold text-blue-500 flex items-center gap-0.5 hover:underline"
                      >
                        <Plus className="h-3 w-3" /> Tambah Baris
                      </button>
                    </div>

                    <div className="space-y-2">
                      {warungMenu.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            type="text"
                            placeholder="Nama Menu"
                            value={item.name}
                            onChange={(e) => handleMenuChange(idx, "name", e.target.value)}
                            className="bg-white/40 dark:bg-zinc-900/40 rounded-xl text-xs h-9 flex-1"
                          />
                          <Input
                            type="number"
                            placeholder="Harga"
                            value={item.price || ""}
                            onChange={(e) => handleMenuChange(idx, "price", e.target.value)}
                            className="bg-white/40 dark:bg-zinc-900/40 rounded-xl text-xs h-9 w-24"
                          />
                          {warungMenu.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMenuRow(idx)}
                              className="text-red-500 hover:text-red-600 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Simpan Warung Ke Database
                  </Button>
                </form>
              )}

              {/* Warungs List */}
              <div className="space-y-3">
                {warungsList.map((w) => (
                  <div
                    key={w.id}
                    className="bg-white/30 dark:bg-zinc-900/30 rounded-2xl border border-border p-4 flex justify-between items-start transition hover:bg-white/55 dark:hover:bg-zinc-900/55"
                  >
                    <div className="space-y-1">
                      <span className="font-extrabold text-sm text-foreground block">{w.name}</span>
                      <span className="text-[11px] text-muted-foreground block">
                        ⭐ {w.rating} • 📍 {w.distance}m • {w.menu.length} menu makanan
                      </span>
                      <div className="flex gap-1.5 pt-1">
                        <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-md">
                          {w.kalori} kkal
                        </span>
                        <span className="text-[10px] bg-zinc-500/10 text-foreground font-bold px-2 py-0.5 rounded-md">
                          {w.protein}g protein
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteWarung(w.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition duration-200"
                      title="Hapus warung"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: KELOLA RESEP KOS */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/40 dark:bg-zinc-800/40 border border-border p-4 rounded-2xl glass-panel">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-blue-500" />
                  <h2 className="font-extrabold text-base">Daftar Resep ({recipesList.length})</h2>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowRecipeForm(!showRecipeForm)}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {showRecipeForm ? (
                    <X className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <Plus className="h-3.5 w-3.5 mr-1" />
                  )}
                  {showRecipeForm ? "Batal" : "Tambah"}
                </Button>
              </div>

              {/* Form Add Recipe */}
              {showRecipeForm && (
                <form
                  onSubmit={handleSubmitRecipe}
                  className="glass-card rounded-2xl p-5 border shadow-xl space-y-4 animate-fade-in"
                >
                  <h3 className="font-bold text-sm text-foreground">Form Tambah Resep Baru</h3>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Nama Resep</Label>
                    <Input
                      type="text"
                      placeholder="Nasi Goreng Telur Orak-arik"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                      className="bg-white/40 dark:bg-zinc-900/40 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Kalori (kkal)</Label>
                      <Input
                        type="number"
                        value={recipeKalori}
                        onChange={(e) => setRecipeKalori(parseInt(e.target.value, 10) || 0)}
                        className="bg-white/40 dark:bg-zinc-900/40 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Protein (g)</Label>
                      <Input
                        type="number"
                        value={recipeProtein}
                        onChange={(e) => setRecipeProtein(parseInt(e.target.value, 10) || 0)}
                        className="bg-white/40 dark:bg-zinc-900/40 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Waktu (mnt)</Label>
                      <Input
                        type="number"
                        value={recipePrepTime}
                        onChange={(e) => setRecipePrepTime(parseInt(e.target.value, 10) || 0)}
                        className="bg-white/40 dark:bg-zinc-900/40 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Kesulitan</Label>
                      <select
                        value={recipeDifficulty}
                        onChange={(e) => setRecipeDifficulty(e.target.value)}
                        className="bg-white/40 dark:bg-zinc-900/40 rounded-xl h-10 text-xs w-full border border-border px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-foreground dark:text-foreground"
                      >
                        <option value="Mudah" className="dark:bg-zinc-900 text-foreground">
                          Mudah
                        </option>
                        <option value="Sedang" className="dark:bg-zinc-900 text-foreground">
                          Sedang
                        </option>
                        <option value="Sulit" className="dark:bg-zinc-900 text-foreground">
                          Sulit
                        </option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Alat (koma)</Label>
                      <Input
                        type="text"
                        placeholder="Wajan, Spatula, Panci"
                        value={recipeTools}
                        onChange={(e) => setRecipeTools(e.target.value)}
                        className="bg-white/40 dark:bg-zinc-900/40 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Ingredients row */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-bold">Bahan Makanan & Harga</Label>
                      <button
                        type="button"
                        onClick={handleAddIngredientRow}
                        className="text-xs font-bold text-blue-500 flex items-center gap-0.5 hover:underline"
                      >
                        <Plus className="h-3 w-3" /> Tambah Bahan
                      </button>
                    </div>

                    <div className="space-y-2">
                      {recipeIngredients.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            type="text"
                            placeholder="Nama Bahan"
                            value={item.name}
                            onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
                            className="bg-white/40 dark:bg-zinc-900/40 rounded-xl text-xs h-9 flex-1"
                          />
                          <Input
                            type="number"
                            placeholder="Harga"
                            value={item.price || ""}
                            onChange={(e) => handleIngredientChange(idx, "price", e.target.value)}
                            className="bg-white/40 dark:bg-zinc-900/40 rounded-xl text-xs h-9 w-24"
                          />
                          {recipeIngredients.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredientRow(idx)}
                              className="text-red-500 hover:text-red-600 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps rows */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs font-bold">Langkah-Langkah Memasak</Label>
                      <button
                        type="button"
                        onClick={handleAddStepRow}
                        className="text-xs font-bold text-blue-500 flex items-center gap-0.5 hover:underline"
                      >
                        <Plus className="h-3 w-3" /> Tambah Langkah
                      </button>
                    </div>

                    <div className="space-y-2">
                      {recipeSteps.map((step, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <span className="text-xs font-bold text-blue-500 w-5 text-center shrink-0">
                            {idx + 1}
                          </span>
                          <Input
                            type="text"
                            placeholder={`Langkah ke-${idx + 1}`}
                            value={step}
                            onChange={(e) => handleStepChange(idx, e.target.value)}
                            className="bg-white/40 dark:bg-zinc-900/40 rounded-xl text-xs h-9 flex-1"
                          />
                          {recipeSteps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveStepRow(idx)}
                              className="text-red-500 hover:text-red-600 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Simpan Resep Ke Database
                  </Button>
                </form>
              )}

              {/* Recipes List */}
              <div className="space-y-3">
                {recipesList.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white/30 dark:bg-zinc-900/30 rounded-2xl border border-border p-4 flex justify-between items-start transition hover:bg-white/55 dark:hover:bg-zinc-900/55"
                  >
                    <div className="space-y-1">
                      <span className="font-extrabold text-sm text-foreground block">{r.name}</span>
                      <span className="text-[11px] text-muted-foreground block">
                        ⏱️ {r.prepTime} menit • {r.difficulty} • {r.ingredients.length} bahan
                        makanan
                      </span>
                      <div className="flex gap-1.5 pt-1">
                        <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-md">
                          {r.kalori} kkal
                        </span>
                        <span className="text-[10px] bg-zinc-500/10 text-foreground font-bold px-2 py-0.5 rounded-md">
                          {r.protein}g protein
                        </span>
                        <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-md">
                          {formatRp(r.total)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRecipe(r.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition duration-200"
                      title="Hapus resep"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
