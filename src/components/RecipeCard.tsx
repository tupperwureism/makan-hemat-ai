import { Flame, Dumbbell, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRp, type Recipe } from "@/lib/mockData";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="font-semibold text-base text-foreground">{recipe.name}</h3>

      <div className="mt-3 space-y-1.5">
        {recipe.ingredients.map((i) => (
          <div
            key={i.name}
            className="flex justify-between text-sm border-b border-dashed border-border last:border-0 pb-1"
          >
            <span className="text-foreground">{i.name}</span>
            <span className="text-muted-foreground">{formatRp(i.price)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-lg bg-primary-soft px-3 py-2">
        <span className="text-sm font-medium text-accent-foreground">Total</span>
        <span className="text-base font-bold text-accent-foreground">{formatRp(recipe.total)}</span>
      </div>

      <div className="mt-2 flex gap-2">
        <div className="flex-1 rounded-lg bg-secondary px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
            <Flame className="h-3.5 w-3.5" /> {recipe.kalori} kkal
          </div>
        </div>
        <div className="flex-1 rounded-lg bg-secondary px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
            <Dumbbell className="h-3.5 w-3.5" /> {recipe.protein}g protein
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" className="mt-3 w-full">
        <MapPin className="h-4 w-4" /> Cari Warung/Pasar Terdekat
      </Button>
    </div>
  );
}
