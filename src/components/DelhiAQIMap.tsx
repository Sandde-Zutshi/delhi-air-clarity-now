import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { getDelhiStationsData, StationData } from "@/lib/delhi-station-api";

// Fix default marker icon issue in Leaflet
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconUrl,
  shadowUrl: iconShadow,
});

// Delhi monitoring stations (will be populated from API)
const DELHI_CENTER = [28.6139, 77.2090] as [number, number];

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
  const [stationsData, setStationsData] = useState<StationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchStationsData = async () => {
    try {
      setLoading(true);
      const data = await getDelhiStationsData();
      setStationsData(data.stations);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching Delhi stations data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStationsData();
    const interval = setInterval(fetchStationsData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Prepare heatmap points: [lat, lon, intensity]
  const heatmapPoints: [number, number, number][] = stationsData
    .filter((station) => station.aqi > 0)
    .map((station) => [station.coordinates.lat, station.coordinates.lon, Math.max(0.1, Math.min(1, station.aqi / 500))] as [number, number, number]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border bg-muted relative">
              {/* @ts-ignore */}
        <MapContainer
          center={DELHI_CENTER}
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
        {/* Markers for stations */}
        {stationsData.map((station) =>
          station.aqi > 0 ? (
            // @ts-ignore
            <Marker
              key={station.id}
              position={[station.coordinates.lat, station.coordinates.lon] as [number, number]}
              icon={L.divIcon({
                className: "custom-marker",
                html: `<div style='background:${getAQIColor(station.aqi)};width:18px;height:18px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 6px #0002;'></div>`
              }) as any}
            >
              // @ts-ignore
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false as false}>
                <div className="text-xs font-semibold">{station.name}</div>
                <div className="text-xs">AQI: <span style={{ color: getAQIColor(station.aqi) }}>{station.aqi}</span></div>
                <div className="text-xs text-muted-foreground">{station.source}</div>
              </Tooltip>
              <Popup>
                <div className="font-bold">{station.name}</div>
                <div>AQI: <span style={{ color: getAQIColor(station.aqi) }}>{station.aqi}</span></div>
                <div className="text-xs text-muted-foreground">Level: {station.aqiLevel}</div>
                <div className="text-xs text-muted-foreground">Source: {station.source}</div>
                <div className="text-xs text-muted-foreground">Updated: {station.lastUpdated.toLocaleTimeString()}</div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
      <div className="absolute top-2 left-2 z-[1000]">
        <span className="inline-block bg-black/70 text-white text-xs px-2 py-1 rounded">
          Delhi Real-time AQI Heatmap & Hotspots
        </span>
      </div>
      <div className="absolute top-2 right-2 z-[1000] text-xs text-muted-foreground">
        Last updated: {lastRefresh.toLocaleTimeString()}
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-[2000]">
          <span className="text-lg font-semibold">Loading Delhi AQI data...</span>
        </div>
      )}
    </div>
  );
} 