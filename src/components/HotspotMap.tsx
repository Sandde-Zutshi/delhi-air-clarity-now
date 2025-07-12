import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, RefreshCw, Activity } from "lucide-react";
import delhiMapImage from "@/assets/delhi-aqi-map.jpg";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getAQIByCoordinates } from "@/lib/api";

interface HotspotData {
  area: string;
  aqi: number;
  change: number;
  coordinates: { lat: number; lon: number };
  lastUpdated: Date;
  loading: boolean;
  error?: string;
}

// Delhi areas with their coordinates
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
  if (aqi <= 50) return "bg-green-500";
  if (aqi <= 100) return "bg-yellow-500";
  if (aqi <= 150) return "bg-orange-500";
  if (aqi <= 200) return "bg-red-500";
  if (aqi <= 300) return "bg-purple-500";
  return "bg-red-900";
};

const getAQILabel = (aqi: number) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

export function HotspotMap() {
  const [hotspotData, setHotspotData] = useState<HotspotData[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize hotspot data
  useEffect(() => {
    const initialData: HotspotData[] = delhiAreas.map(area => ({
      area: area.name,
      aqi: 0,
      change: 0,
      coordinates: { lat: area.lat, lon: area.lon },
      lastUpdated: new Date(),
      loading: true
    }));
    setHotspotData(initialData);
  }, []);

  // Fetch AQI data for all areas
  const fetchAllAreasData = async () => {
    setIsRefreshing(true);
    const updatedData = await Promise.all(
      delhiAreas.map(async (area, index) => {
        try {
          const data = await getAQIByCoordinates(area.lat, area.lon);
          const previousAQI = hotspotData[index]?.aqi || 0;
          const change = previousAQI > 0 ? Math.round(((data.aqi - previousAQI) / previousAQI) * 100) : 0;
          
          return {
            area: area.name,
            aqi: data.aqi,
            change,
            coordinates: { lat: area.lat, lon: area.lon },
            lastUpdated: new Date(),
            loading: false
          };
        } catch (error) {
          return {
            area: area.name,
            aqi: 0,
            change: 0,
            coordinates: { lat: area.lat, lon: area.lon },
            lastUpdated: new Date(),
            loading: false,
            error: "Failed to fetch data"
          };
        }
      })
    );
    
    setHotspotData(updatedData);
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  // Initial data fetch
  useEffect(() => {
    if (hotspotData.length > 0 && hotspotData[0].loading) {
      fetchAllAreasData();
    }
  }, [hotspotData.length]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllAreasData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const criticalAreas = hotspotData.filter(area => area.aqi > 200 && !area.loading && !area.error).length;
  const sortedAreas = [...hotspotData].sort((a, b) => b.aqi - a.aqi);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Delhi Real-Time AQI Hotspots
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-xs">
              {criticalAreas} Critical Areas
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllAreasData}
              disabled={isRefreshing}
              className="h-7 px-2"
            >
              <RefreshCw className={cn("w-3 h-3", isRefreshing && "animate-spin")} />
            </Button>
          </div>
        </CardTitle>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-green-500" />
            <span>Live Data</span>
          </div>
          <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <span>Auto-refresh: 5 min</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Visualization */}
        <div className="relative rounded-lg overflow-hidden border bg-muted">
          <img 
            src={delhiMapImage} 
            alt="Delhi Air Quality Map" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Real-time hotspots overlay */}
          <div className="absolute inset-0">
            {hotspotData.map((spot, index) => {
              if (spot.loading || spot.error) return null;
              
              // Calculate position on map (simplified positioning)
              const positions = [
                { top: "20%", left: "75%" }, // Anand Vihar
                { top: "15%", left: "25%" }, // Jahangirpuri
                { top: "45%", left: "60%" }, // R.K. Puram
                { top: "70%", left: "40%" }, // Dwarka
                { top: "35%", left: "50%" }, // Connaught Place
                { top: "40%", left: "55%" }, // India Gate
                { top: "55%", left: "65%" }, // Lajpat Nagar
                { top: "30%", left: "45%" }, // Karol Bagh
                { top: "10%", left: "35%" }, // Pitampura
                { top: "8%", left: "30%" }   // Rohini
              ];
              
              return (
                <div
                  key={spot.area}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={positions[index]}
                >
                  <div className="relative">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 border-white shadow-lg",
                      getAQIColor(spot.aqi)
                    )} />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {spot.aqi}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
              Real-time AQI Monitoring
            </Badge>
          </div>
        </div>

        {/* Hotspot List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Key Areas (Highest to Lowest AQI)
          </h4>
          {sortedAreas.map((spot, index) => (
            <div 
              key={spot.area}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                {spot.loading ? (
                  <div className="w-3 h-3 rounded-full bg-gray-400 animate-pulse" />
                ) : spot.error ? (
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                ) : (
                  <div className={cn("w-3 h-3 rounded-full", getAQIColor(spot.aqi))} />
                )}
                <div>
                  <span className="font-medium text-sm">{spot.area}</span>
                  {!spot.loading && !spot.error && (
                    <div className="text-xs text-muted-foreground">
                      {getAQILabel(spot.aqi)}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {spot.loading ? (
                  <div className="w-8 h-4 bg-gray-200 rounded animate-pulse" />
                ) : spot.error ? (
                  <span className="text-xs text-red-500">Error</span>
                ) : (
                  <>
                    <span className="text-sm font-bold">{spot.aqi}</span>
                    {spot.change !== 0 && (
                      <div className={cn(
                        "flex items-center gap-1 text-xs",
                        spot.change > 0 ? "text-red-600" : "text-green-600"
                      )}>
                        <TrendingUp className={cn(
                          "w-3 h-3",
                          spot.change < 0 && "rotate-180"
                        )} />
                        {Math.abs(spot.change)}%
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span>Unhealthy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Very Unhealthy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span>Hazardous</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}