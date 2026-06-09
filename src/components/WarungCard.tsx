import { Star, MapPin, Flame, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRp, type Warung } from "@/lib/mockData";

export function WarungCard({
  warung,
  onSelect,
}: {
  warung: Warung;
  onSelect?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-base text-foreground">{warung.name}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {warung.rating}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {warung.distance}m
            </span>
          </div>
        </div>
        <Button size="sm" onClick={onSelect}>
          Pilih
        </Button>
      </div>

      <div className="mt-3 space-y-1.5">
        {warung.menu.map((m) => (
          <div
            key={m.name}
            className="flex justify-between text-sm border-b border-dashed border-border last:border-0 pb-1"
          >
            <span className="text-foreground">{m.name}</span>
            <span className="font-medium text-foreground">{formatRp(m.price)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <div className="flex-1 rounded-lg bg-primary-soft px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-xs text-accent-foreground">
            <Flame className="h-3.5 w-3.5" /> Kalori
          </div>
          <div className="text-sm font-semibold text-accent-foreground">
            {warung.kalori} kkal
          </div>
        </div>
        <div className="flex-1 rounded-lg bg-secondary px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
            <Dumbbell className="h-3.5 w-3.5" /> Protein
          </div>
          <div className="text-sm font-semibold text-secondary-foreground">
            {warung.protein}g
          </div>
        </div>
      </div>
    </div>
  );
}
