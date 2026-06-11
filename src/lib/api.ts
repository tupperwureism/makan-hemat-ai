import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Initial fallback data for read-only serverless environments
const INITIAL_FALLBACK = {
  warungs: [
    {
      id: 1,
      name: "Warteg Bu Sari",
      rating: 4.5,
      distance: 150,
      menu: [
        { name: "Nasi + Ayam", price: 13000 },
        { name: "Nasi + Tempe", price: 8000 },
        { name: "Nasi + Telur", price: 10000 },
      ],
      kalori: 620,
      protein: 25,
      lat: -7.051,
      lng: 110.4365,
    },
    {
      id: 2,
      name: "Warung Makan Pak Haji",
      rating: 4.3,
      distance: 280,
      menu: [
        { name: "Nasi Gudeg", price: 12000 },
        { name: "Nasi Pecel", price: 9000 },
        { name: "Nasi Sayur", price: 8000 },
      ],
      kalori: 580,
      protein: 20,
      lat: -7.0535,
      lng: 110.438,
    },
    {
      id: 3,
      name: "Warteg Barokah",
      rating: 4.6,
      distance: 320,
      menu: [
        { name: "Nasi + Lele", price: 15000 },
        { name: "Nasi + Tahu", price: 8000 },
        { name: "Nasi + Rendang", price: 18000 },
      ],
      kalori: 700,
      protein: 30,
      lat: -7.052,
      lng: 110.439,
    },
    {
      id: 4,
      name: "Warung Nasi Bu Endang",
      rating: 4.4,
      distance: 410,
      menu: [
        { name: "Nasi Campur", price: 13000 },
        { name: "Nasi + Ikan", price: 14000 },
        { name: "Nasi + Tempe Orek", price: 9000 },
      ],
      kalori: 650,
      protein: 22,
      lat: -7.0545,
      lng: 110.4355,
    },
    {
      id: 5,
      name: "Kedai Mahasiswa",
      rating: 4.2,
      distance: 500,
      menu: [
        { name: "Nasi + Ayam Bakar", price: 16000 },
        { name: "Nasi + Telur Dadar", price: 10000 },
        { name: "Nasi + Capcay", price: 12000 },
      ],
      kalori: 600,
      protein: 28,
      lat: -7.0505,
      lng: 110.441,
    },
  ],
  recipes: [
    {
      id: 1,
      name: "Telur Dadar Kecap",
      ingredients: [
        { name: "Telur", price: 3000 },
        { name: "Kecap", price: 2000 },
        { name: "Minyak", price: 1000 },
      ],
      total: 6000,
      kalori: 350,
      protein: 18,
      prepTime: 5,
      difficulty: "Mudah",
      tools: ["Wajan", "Spatula"],
      steps: [
        "Pecahkan telur ke dalam mangkuk kecil, tambahkan sedikit garam dan lada, lalu kocok lepas.",
        "Panaskan wajan dengan minyak secukupnya.",
        "Tuang kocokan telur ke wajan, goreng hingga sisi bawah matang.",
        "Balik telur dadar, lalu tuangkan kecap manis secukupnya di atasnya.",
        "Lipat telur menjadi dua, matangkan sejenak, dan sajikan dengan nasi hangat.",
      ],
    },
    {
      id: 2,
      name: "Tempe Goreng Sambal",
      ingredients: [
        { name: "Tempe", price: 4000 },
        { name: "Cabai", price: 2000 },
        { name: "Minyak", price: 1000 },
      ],
      total: 7000,
      kalori: 400,
      protein: 20,
      prepTime: 10,
      difficulty: "Mudah",
      tools: ["Wajan", "Cobek/Ulekan"],
      steps: [
        "Potong tempe menjadi beberapa bagian, beri guratan, lalu rendam di air garam sejenak.",
        "Panaskan wajan berisi minyak goreng secukupnya.",
        "Goreng tempe hingga matang berwarna kuning keemasan, lalu tiriskan.",
        "Siapkan ulekan, masukkan cabai rawit, bawang putih, garam, dan sedikit terasi goreng.",
        "Ulek bumbu sambal hingga halus, beri sesendok minyak goreng panas bekas menggoreng tempe, lalu geprek tempe di atasnya.",
      ],
    },
    {
      id: 3,
      name: "Mie Goreng Telur",
      ingredients: [
        { name: "Mie Instan", price: 3500 },
        { name: "Telur", price: 3000 },
        { name: "Sayur", price: 2000 },
      ],
      total: 8500,
      kalori: 450,
      protein: 15,
      prepTime: 8,
      difficulty: "Mudah",
      tools: ["Panci kecil", "Saringan", "Piring"],
      steps: [
        "Rebus air dalam panci kecil hingga mendidih.",
        "Masukkan mie instan ke dalam air mendidih, masak selama 2 menit.",
        "Masukkan sayuran (sawi/kol) ke dalam air rebusan mie pada menit terakhir.",
        "Sementara itu, siapkan bumbu mie instan di piring.",
        "Tiriskan mie dan sayur, lalu masukkan telur mentah ke air sisa rebusan yang mendidih untuk dibuat telur rebus setengah matang (poached egg).",
        "Campurkan mie dan sayur dengan bumbu di piring, lalu sajikan bersama telur rebus di atasnya.",
      ],
    },
  ],
};

// Global in-memory cache for database fallback
const getMemoryDb = () => {
  const g = globalThis as any;
  if (!g.__cachedDb) {
    g.__cachedDb = JSON.parse(JSON.stringify(INITIAL_FALLBACK));
  }
  return g.__cachedDb;
};

// Safe helper to read DB on the server
async function readDb() {
  if (typeof window !== "undefined") return INITIAL_FALLBACK;
  try {
    const fs = await import("node:fs/promises");
    const { join } = await import("node:path");
    const dbPath = join(process.cwd(), "src", "lib", "db.json");
    const data = await fs.readFile(dbPath, "utf-8");
    const parsed = JSON.parse(data);
    // Keep memory cache updated
    (globalThis as any).__cachedDb = parsed;
    return parsed;
  } catch (e) {
    return getMemoryDb();
  }
}

// Safe helper to write DB on the server
async function writeDb(data: any) {
  if (typeof window !== "undefined") return false;
  // Update memory cache
  (globalThis as any).__cachedDb = data;
  try {
    const fs = await import("node:fs/promises");
    const { join } = await import("node:path");
    const dbPath = join(process.cwd(), "src", "lib", "db.json");
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (e) {
    return false;
  }
}

export const getWarungs = createServerFn({ method: "POST" }).handler(async () => {
  const db = await readDb();
  return db.warungs;
});

export const getRecipes = createServerFn({ method: "POST" }).handler(async () => {
  const db = await readDb();
  return db.recipes;
});

export const addWarung = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      rating: z.number().min(0).max(5),
      distance: z.number().min(0),
      menu: z.array(
        z.object({
          name: z.string().min(1),
          price: z.number().min(0),
        }),
      ),
      kalori: z.number().min(0),
      protein: z.number().min(0),
      lat: z.number(),
      lng: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    const db = await readDb();
    const nextId = db.warungs.length > 0 ? Math.max(...db.warungs.map((w: any) => w.id)) + 1 : 1;
    const newWarung = { id: nextId, ...data };
    db.warungs.push(newWarung);
    await writeDb(db);
    return newWarung;
  });

export const addRecipe = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      ingredients: z.array(
        z.object({
          name: z.string().min(1),
          price: z.number().min(0),
        }),
      ),
      total: z.number().min(0),
      kalori: z.number().min(0),
      protein: z.number().min(0),
      prepTime: z.number().min(1),
      difficulty: z.string(),
      tools: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  )
  .handler(async ({ data }) => {
    const db = await readDb();
    const nextId = db.recipes.length > 0 ? Math.max(...db.recipes.map((r: any) => r.id)) + 1 : 1;
    const newRecipe = { id: nextId, ...data };
    db.recipes.push(newRecipe);
    await writeDb(db);
    return newRecipe;
  });

export const deleteWarung = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const db = await readDb();
    db.warungs = db.warungs.filter((w: any) => w.id !== data.id);
    await writeDb(db);
    return { success: true };
  });

export const deleteRecipe = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    const db = await readDb();
    db.recipes = db.recipes.filter((r: any) => r.id !== data.id);
    await writeDb(db);
    return { success: true };
  });
