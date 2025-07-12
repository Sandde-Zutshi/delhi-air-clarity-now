import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { getAQIByCoordinates } from "@/lib/api";

// Fix default marker icon issue in Leaflet
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconUrl,
  shadowUrl: iconShadow,
});

const delhiAreas = [
  { name: "Anand Vihar", lat: 28.6504, lon: 77.3153 },
  { name: "Jahangirpuri", lat: 28.7328, lon: 77.0897 },
  { name: "R.K. Puram", lat: 28.5642, lon: 77.2025 },
  { name: "Dwarka", lat: 28.5682, lon: 77.0645 },
  { name: "Connaught Place", lat: 28.6315, lon: 77.2167 },
  { name: "India Gate", lat: 28.6129, lon: 77.2295 },
  { name: "Lajpat Nagar", lat: 28.5675, lon: 77.2431 },
  { name: "Karol Bagh", lat: 28.6517, lon: 77.2219 },
  { name: "Pitampura", lat: 28.6980, lon: 77.1215 },
  { name: "Rohini", lat: 28.7438, lon: 77.0728 }
];

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "#22c55e"; // green
  if (aqi <= 100) return "#eab308"; // yellow
  if (aqi <= 150) return "#f59e42"; // orange
  if (aqi <= 200) return "#ef4444"; // red
  if (aqi <= 300) return "#8b5cf6"; // purple
  return "#991b1b"; // maroon
};

function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();
  const heatLayerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }
    // @ts-ignore
    heatLayerRef.current = L.heatLayer(points, { radius: 40, blur: 30, maxZoom: 15, gradient: {
      0.1: "#22c55e",
      0.3: "#eab308",
      0.5: "#f59e42",
      0.7: "#ef4444",
      0.9: "#8b5cf6",
      1.0: "#991b1b"
    } });
    heatLayerRef.current.addTo(map);
    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [points, map]);
  return null;
}

export function DelhiAQIMap() {
  const [aqiData, setAqiData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchAllAreasData = async () => {
    setLoading(true);
    const results = await Promise.all(
      delhiAreas.map(async (area) => {
        try {
          const data = await getAQIByCoordinates(area.lat, area.lon);
          return {
            ...area,
            aqi: data.aqi,
            lastUpdated: new Date(),
          };
        } catch (error) {
          return {
            ...area,
            aqi: null,
            lastUpdated: new Date(),
          };
        }
      })
    );
    setAqiData(results);
    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchAllAreasData();
    const interval = setInterval(fetchAllAreasData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Prepare heatmap points: [lat, lon, intensity]
  const heatmapPoints: [number, number, number][] = aqiData
    .filter((d) => typeof d.aqi === "number")
    .map((d) => [d.lat, d.lon, Math.max(0.1, Math.min(1, d.aqi / 500))] as [number, number, number]);



  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border bg-muted relative">
      {/* @ts-ignore */}
      <MapContainer
        center={[28.6139, 77.2090] as [number, number]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* @ts-ignore */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Heatmap overlay */}
        <HeatmapLayer points={heatmapPoints} />
        {/* Markers for hotspots */}
        {aqiData.map((area, idx) =>
          typeof area.aqi === "number" ? (
            // @ts-ignore
            <Marker
              key={area.name}
              position={[area.lat, area.lon] as [number, number]}
              icon={L.divIcon({
                className: "custom-marker",
                html: `<div style='background:${getAQIColor(area.aqi)};width:18px;height:18px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 6px #0002;'></div>`
              }) as any}
            >
              // @ts-ignore
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false as false}>
                <div className="text-xs font-semibold">{area.name}</div>
                <div className="text-xs">AQI: <span style={{ color: getAQIColor(area.aqi) }}>{area.aqi}</span></div>
              </Tooltip>
              <Popup>
                <div className="font-bold">{area.name}</div>
                <div>AQI: <span style={{ color: getAQIColor(area.aqi) }}>{area.aqi}</span></div>
                <div className="text-xs text-muted-foreground">Last updated: {lastRefresh.toLocaleTimeString()}</div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
      <div className="absolute top-2 left-2 z-[1000]">
        <span className="inline-block bg-black/70 text-white text-xs px-2 py-1 rounded">Real-time AQI Heatmap & Hotspots</span>
      </div>
      <div className="absolute top-2 right-2 z-[1000] text-xs text-muted-foreground">
        Last updated: {lastRefresh.toLocaleTimeString()}
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-[2000]">
          <span className="text-lg font-semibold">Loading AQI data...</span>
        </div>
      )}
    </div>
  );
} 