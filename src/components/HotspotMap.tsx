import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp } from "lucide-react";
import delhiMapImage from "@/assets/delhi-aqi-map.jpg";
import { cn } from "@/lib/utils";

interface HotspotData {
  area: string;
  aqi: number;
  change: number;
}

const hotspotData: HotspotData[] = [
  { area: "Anand Vihar", aqi: 324, change: 15 },
  { area: "Jahangirpuri", aqi: 298, change: 8 },
  { area: "R.K. Puram", aqi: 276, change: -3 },
  { area: "Dwarka", aqi: 245, change: 12 },
  { area: "Connaught Place", aqi: 189, change: 5 },
  { area: "India Gate", aqi: 156, change: -8 }
];

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "aqi-good";
  if (aqi <= 100) return "aqi-moderate";
  if (aqi <= 150) return "aqi-unhealthy-sensitive";
  if (aqi <= 200) return "aqi-unhealthy";
  if (aqi <= 300) return "aqi-very-unhealthy";
  return "aqi-hazardous";
};

export function HotspotMap() {
  const criticalAreas = hotspotData.filter(area => area.aqi > 200).length;
  
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Delhi AQI Hotspots
          </div>
          <Badge variant="destructive" className="text-xs">
            {criticalAreas} Critical Areas
          </Badge>
        </CardTitle>
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
          {hotspotData.map((spot, index) => (
            <div 
              key={spot.area}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className={cn(
                    "w-3 h-3 rounded-full",
                    `bg-${getAQIColor(spot.aqi)}`
                  )}
                />
                <span className="font-medium text-sm">{spot.area}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold">{spot.aqi}</span>
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  spot.change > 0 ? "text-red-600" : spot.change < 0 ? "text-green-600" : "text-muted-foreground"
                )}>
                  {spot.change !== 0 && (
                    <TrendingUp className={cn(
                      "w-3 h-3",
                      spot.change < 0 && "rotate-180"
                    )} />
                  )}
                  {Math.abs(spot.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}