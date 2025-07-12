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

// City area definitions
const cityAreas: { [key: string]: Array<{ name: string; lat: number; lon: number }> } = {
  "Delhi": [
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
  ],
  "Mumbai": [
    { name: "Andheri", lat: 19.1197, lon: 72.8464 },
    { name: "Bandra", lat: 19.0596, lon: 72.8295 },
    { name: "Colaba", lat: 18.9149, lon: 72.8316 },
    { name: "Dadar", lat: 19.0170, lon: 72.8478 },
    { name: "Juhu", lat: 19.0990, lon: 72.8347 },
    { name: "Kurla", lat: 19.0750, lon: 72.8826 },
    { name: "Malad", lat: 19.1863, lon: 72.8486 },
    { name: "Nariman Point", lat: 18.9204, lon: 72.8301 },
    { name: "Powai", lat: 19.1197, lon: 72.9064 },
    { name: "Worli", lat: 19.0176, lon: 72.8138 }
  ],
  "Bangalore": [
    { name: "Indiranagar", lat: 12.9716, lon: 77.6412 },
    { name: "Koramangala", lat: 12.9352, lon: 77.6245 },
    { name: "Whitefield", lat: 12.9692, lon: 77.7499 },
    { name: "Electronic City", lat: 12.8458, lon: 77.6658 },
    { name: "Marathahalli", lat: 12.9584, lon: 77.7014 },
    { name: "HSR Layout", lat: 12.9141, lon: 77.6386 },
    { name: "JP Nagar", lat: 12.9067, lon: 77.5851 },
    { name: "Bannerghatta", lat: 12.8000, lon: 77.5767 },
    { name: "Hebbal", lat: 13.0507, lon: 77.5934 },
    { name: "Yelahanka", lat: 13.1007, lon: 77.5963 }
  ],
  "Chennai": [
    { name: "T Nagar", lat: 13.0367, lon: 80.2420 },
    { name: "Anna Nagar", lat: 13.0827, lon: 80.2707 },
    { name: "Adyar", lat: 13.0067, lon: 80.2544 },
    { name: "Mylapore", lat: 13.0377, lon: 80.2707 },
    { name: "Velachery", lat: 12.9789, lon: 80.2204 },
    { name: "Porur", lat: 13.0319, lon: 80.1587 },
    { name: "Tambaram", lat: 12.9242, lon: 80.1274 },
    { name: "Chromepet", lat: 12.9516, lon: 80.1395 },
    { name: "Pallavaram", lat: 12.9677, lon: 80.1505 },
    { name: "St. Thomas Mount", lat: 12.9954, lon: 80.1969 }
  ],
  "Kolkata": [
    { name: "Park Street", lat: 22.5510, lon: 88.3518 },
    { name: "Salt Lake", lat: 22.5726, lon: 88.3639 },
    { name: "Howrah", lat: 22.5958, lon: 88.2636 },
    { name: "Dum Dum", lat: 22.6333, lon: 88.4167 },
    { name: "New Town", lat: 22.5867, lon: 88.4614 },
    { name: "Ballygunge", lat: 22.5267, lon: 88.3639 },
    { name: "Alipore", lat: 22.5300, lon: 88.3300 },
    { name: "Behala", lat: 22.4833, lon: 88.3167 },
    { name: "Garia", lat: 22.4667, lon: 88.4000 },
    { name: "Barrackpore", lat: 22.7667, lon: 88.3667 }
  ],
  "Hyderabad": [
    { name: "Banjara Hills", lat: 17.4065, lon: 78.4772 },
    { name: "Jubilee Hills", lat: 17.4333, lon: 78.4167 },
    { name: "Hitech City", lat: 17.4474, lon: 78.3765 },
    { name: "Secunderabad", lat: 17.4399, lon: 78.4983 },
    { name: "Begumpet", lat: 17.4432, lon: 78.4732 },
    { name: "Kukatpally", lat: 17.4849, lon: 78.4136 },
    { name: "Gachibowli", lat: 17.4401, lon: 78.3489 },
    { name: "Madhapur", lat: 17.4483, lon: 78.3915 },
    { name: "Kondapur", lat: 17.4700, lon: 78.3600 },
    { name: "Manikonda", lat: 17.4833, lon: 78.3333 }
  ],
  "Pune": [
    { name: "Koregaon Park", lat: 18.5291, lon: 73.8565 },
    { name: "Kalyani Nagar", lat: 18.5476, lon: 73.9035 },
    { name: "Viman Nagar", lat: 18.5676, lon: 73.9111 },
    { name: "Hinjewadi", lat: 18.5912, lon: 73.7419 },
    { name: "Baner", lat: 18.5590, lon: 73.7868 },
    { name: "Aundh", lat: 18.5529, lon: 73.8075 },
    { name: "Wakad", lat: 18.5993, lon: 73.7625 },
    { name: "Pimple Saudagar", lat: 18.5912, lon: 73.7419 },
    { name: "Kharadi", lat: 18.5529, lon: 73.9419 },
    { name: "Magarpatta", lat: 18.5291, lon: 73.9419 }
  ],
  "Ahmedabad": [
    { name: "Satellite", lat: 23.0225, lon: 72.5714 },
    { name: "Vastrapur", lat: 23.0225, lon: 72.5714 },
    { name: "Navrangpura", lat: 23.0225, lon: 72.5714 },
    { name: "Ellisbridge", lat: 23.0225, lon: 72.5714 },
    { name: "Paldi", lat: 23.0225, lon: 72.5714 },
    { name: "Bodakdev", lat: 23.0225, lon: 72.5714 },
    { name: "Thaltej", lat: 23.0225, lon: 72.5714 },
    { name: "Gujarat High Court", lat: 23.0225, lon: 72.5714 },
    { name: "ISRO", lat: 23.0225, lon: 72.5714 },
    { name: "Gandhinagar", lat: 23.2156, lon: 72.6369 }
  ]
};

// Default city centers
const cityCenters: { [key: string]: [number, number] } = {
  "Delhi": [28.6139, 77.2090],
  "Mumbai": [19.0760, 72.8777],
  "Bangalore": [12.9716, 77.5946],
  "Chennai": [13.0827, 80.2707],
  "Kolkata": [22.5726, 88.3639],
  "Hyderabad": [17.3850, 78.4867],
  "Pune": [18.5204, 73.8567],
  "Ahmedabad": [23.0225, 72.5714]
};

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

interface AQIMapProps {
  location?: string;
  aqiData?: any;
}

export function AQIMap({ location = "Delhi", aqiData }: AQIMapProps) {
  const [mapAqiData, setMapAqiData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Get areas for the selected city
  const getAreasForCity = (city: string) => {
    return cityAreas[city] || cityAreas["Delhi"];
  };

  // Get center for the selected city
  const getCenterForCity = (city: string) => {
    return cityCenters[city] || cityCenters["Delhi"];
  };

  const fetchAllAreasData = async () => {
    setLoading(true);
    const areas = getAreasForCity(location);
    
    const results = await Promise.all(
      areas.map(async (area) => {
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
    setMapAqiData(results);
    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchAllAreasData();
    const interval = setInterval(fetchAllAreasData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  // Prepare heatmap points: [lat, lon, intensity]
  const heatmapPoints: [number, number, number][] = mapAqiData
    .filter((d) => typeof d.aqi === "number")
    .map((d) => [d.lat, d.lon, Math.max(0.1, Math.min(1, d.aqi / 500))] as [number, number, number]);

  const mapCenter = getCenterForCity(location);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border bg-muted relative">
      {/* @ts-ignore */}
      <MapContainer
        center={mapCenter}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        key={location} // Force re-render when location changes
      >
        {/* @ts-ignore */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Heatmap overlay */}
        <HeatmapLayer points={heatmapPoints} />
        {/* Markers for hotspots */}
        {mapAqiData.map((area, idx) =>
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
        <span className="inline-block bg-black/70 text-white text-xs px-2 py-1 rounded">
          {location} Real-time AQI Heatmap & Hotspots
        </span>
      </div>
      <div className="absolute top-2 right-2 z-[1000] text-xs text-muted-foreground">
        Last updated: {lastRefresh.toLocaleTimeString()}
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-[2000]">
          <span className="text-lg font-semibold">Loading {location} AQI data...</span>
        </div>
      )}
    </div>
  );
}

// Keep the old name for backward compatibility
export const DelhiAQIMap = AQIMap; 