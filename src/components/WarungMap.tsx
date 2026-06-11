import { useEffect, useRef } from "react";
import type L from "leaflet";
import type { Warung } from "@/lib/mockData";

const center: [number, number] = [-7.0527, 110.4377];

export function WarungMap({ warungs }: { warungs: Warung[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    let active = true;

    async function initMap() {
      // Dynamic imports for browser-only Leaflet modules
      const Leaflet = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!active || !ref.current) return;

      // Fix default marker icons
      delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = Leaflet.map(ref.current).setView(center, 16);
      Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      Leaflet.circleMarker(center, {
        radius: 8,
        color: "#F97316",
        fillColor: "#F97316",
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup("Lokasi kamu (Tembalang)");

      warungs.forEach((w) => {
        Leaflet.marker([w.lat, w.lng])
          .addTo(map)
          .bindPopup(`<strong>${w.name}</strong><br/>⭐ ${w.rating} • ${w.distance}m`);
      });

      mapRef.current = map;
    }

    initMap();

    return () => {
      active = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
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
