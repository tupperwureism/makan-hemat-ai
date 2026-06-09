import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Warung } from "@/lib/mockData";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const center: [number, number] = [-7.0527, 110.4377];

export function WarungMap({ warungs }: { warungs: Warung[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current).setView(center, 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    L.circleMarker(center, {
      radius: 8,
      color: "#F97316",
      fillColor: "#F97316",
      fillOpacity: 1,
    })
      .addTo(map)
      .bindPopup("Lokasi kamu (Tembalang)");

    warungs.forEach((w) => {
      L.marker([w.lat, w.lng])
        .addTo(map)
        .bindPopup(`<strong>${w.name}</strong><br/>⭐ ${w.rating} • ${w.distance}m`);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [warungs]);

  return (
    <div
      ref={ref}
      style={{ height: 250 }}
      className="w-full rounded-xl overflow-hidden border border-border z-0"
    />
  );
}
