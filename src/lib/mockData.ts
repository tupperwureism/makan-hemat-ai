export type Warung = {
  id: number;
  name: string;
  rating: number;
  distance: number; // meters
  menu: { name: string; price: number }[];
  kalori: number;
  protein: number;
  lat: number;
  lng: number;
};

export const warungs: Warung[] = [
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
];

export type Recipe = {
  id: number;
  name: string;
  ingredients: { name: string; price: number }[];
  total: number;
  kalori: number;
  protein: number;
};

export const recipes: Recipe[] = [
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
  },
];

export const formatRp = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");

export const criteriaOptions = [
  { id: "sayur", label: "🥗 Banyak sayur" },
  { id: "protein", label: "💪 Tinggi protein" },
  { id: "dekat", label: "📍 Dekat saya" },
  { id: "porsi", label: "🍚 Porsi besar" },
  { id: "pedas", label: "🌶️ Pedas" },
  { id: "murah", label: "💰 Semurah mungkin" },
];
