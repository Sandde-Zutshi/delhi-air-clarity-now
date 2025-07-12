import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusButton, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Activity, Wind, CloudRain, Sun, AlertTriangle, Skull } from "lucide-react";
import { getAQIColorInfo, getAQILevel, getHealthImplications, getCautionStatement } from "@/lib/aqi-colors";
import { Sparklines, SparklinesLine } from 'react-sparklines';

interface AQICardProps {
  aqi: number;
  location?: string;
  className?: string;
  trend?: "up" | "down" | "stable";
  previousAqi?: number;
  onLearnMore?: (level: any) => void;
  source?: string;
  aqiLevel?: string;
  healthImplications?: string;
}

// Generate realistic 24-hour AQI trend data that resets at midnight
function generate24HourAQITrend(currentAQI: number): number[] {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Create a seed based on date (resets daily)
  const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const seed = dateSeed;
  
  // Generate 24 data points (one per hour)
  const trend: number[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    // Base value with daily pattern (higher during day, lower at night)
    let baseValue = currentAQI;
    
    // Add daily variation pattern for Delhi (peak pollution during morning and evening)
    if (hour >= 6 && hour <= 9) {
      // Morning rush hour: higher values
      baseValue *= 1.3 + (Math.sin((hour - 6) * Math.PI / 6) * 0.2);
    } else if (hour >= 17 && hour <= 21) {
      // Evening rush hour: higher values
      baseValue *= 1.4 + (Math.sin((hour - 17) * Math.PI / 8) * 0.3);
    } else if (hour >= 10 && hour <= 16) {
      // Daytime: moderate values
      baseValue *= 1.1 + (Math.sin((hour - 10) * Math.PI / 12) * 0.15);
    } else {
      // Nighttime: lower values
      baseValue *= 0.8 + (Math.sin((hour - 22) * Math.PI / 8) * 0.1);
    }
    
    // Add some randomness based on seed and hour
    const randomFactor = 0.9 + (Math.sin(seed + hour * 11) * 0.15);
    const finalValue = Math.max(0, baseValue * randomFactor);
    
    // For current hour, use the actual current value
    if (hour === currentHour) {
      trend.push(currentAQI);
    } else if (hour < currentHour) {
      // Past hours: use generated value
      trend.push(Math.round(finalValue));
    } else {
      // Future hours: use a projection based on current trend
      const projection = currentAQI * (0.8 + Math.random() * 0.4);
      trend.push(Math.round(projection));
    }
  }
  
  return trend;
}

// Icon mapping for different AQI levels
const getAQIIcon = (aqi: number) => {
  if (aqi <= 50) return Sun;
  if (aqi <= 100) return Wind;
  if (aqi <= 150) return CloudRain;
  if (aqi <= 200) return AlertTriangle;
  return Skull;
};

export function AQICard({ aqi, location = "Delhi", className, trend = "stable", previousAqi, onLearnMore, source, aqiLevel, healthImplications }: AQICardProps) {
  if (!aqi || aqi < 0) {
    return (
      <div className={cn("rounded-2xl p-8 text-center bg-muted/50 text-muted-foreground shadow-lg min-h-[180px] flex flex-col items-center justify-center", className)}>
        <span className="text-2xl font-bold mb-2">No AQI Data</span>
        <span className="text-sm">Air quality data is currently unavailable for this location.</span>
      </div>
    );
  }
  
  // Get AQI color info using the new system
  const aqiColorInfo = getAQIColorInfo(aqi);
  const label = aqiLevel || getAQILevel(aqi);
  const AQIIcon = getAQIIcon(aqi);
  
  // Use provided health implications or get from AQI value
  const displayDescription = healthImplications || getHealthImplications(aqi);
  
  // Generate 24-hour AQI trend data
  const trendData = generate24HourAQITrend(aqi);
  
  const getTrendIcon = () => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4" />;
      case "down": return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };
  
  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-red-500";
      case "down": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className={cn("border-0 glass-card hover-lift animate-fade-in-up", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-muted-foreground">
            Air Quality Index
          </CardTitle>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500 animate-pulse-soft" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{location}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <div 
            className="rounded-2xl p-8 text-center transition-all duration-500 hover-scale shadow-lg text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${aqiColorInfo.gradient[0]}, ${aqiColorInfo.gradient[1]})`
            }}
          >
            {/* Background Icon */}
            <div className="absolute top-4 right-4 opacity-20">
              <AQIIcon className="w-16 h-16" />
            </div>
            
            {/* AQI Value Display */}
            <div className="text-6xl font-bold mb-2 animate-scale-in">{aqi}</div>
            <div className="text-2xl font-semibold mb-3 opacity-95">{label}</div>
            <div className="text-base font-medium opacity-90 mb-2">{displayDescription}</div>
            
            {/* Data Source Badge */}
            {source && (
              <div className="absolute top-4 left-4">
                <Badge className="text-xs bg-white/20 text-white border-white/30">
                  {source}
                </Badge>
              </div>
            )}
            
            {previousAqi && (
              <div className={cn("flex items-center justify-center gap-2 mt-3 text-sm", getTrendColor())}>
                {getTrendIcon()}
                <span>
                  {trend === "up" ? "+" : trend === "down" ? "-" : ""}
                  {Math.abs(aqi - previousAqi)} from last hour
                </span>
              </div>
            )}
          </div>
          
          {/* Floating gradient orb */}
          <div 
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-60 animate-bounce-subtle"
            style={{
              background: `linear-gradient(135deg, ${aqiColorInfo.gradient[0]}, ${aqiColorInfo.gradient[1]})`
            }}
          />
        </div>
        
        {/* 24-Hour AQI Trend Graph */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-xs text-center mb-3 opacity-80 text-muted-foreground">
            24-Hour AQI Trend
          </div>
          <Sparklines data={trendData} width={300} height={40} margin={5}>
            <SparklinesLine 
              style={{ 
                stroke: aqiColorInfo.hex, 
                strokeWidth: 2, 
                fill: "none" 
              }} 
            />
          </Sparklines>
        </div>
        
        <div className="flex justify-center">
          {onLearnMore && (
            <Button
              onClick={() => onLearnMore({ 
                name: label, 
                range: [0, 0], 
                gradient: aqiColorInfo.gradient, 
                icon: AQIIcon, 
                description: displayDescription, 
                protectionLevel: label 
              })}
              variant="outline"
              size="sm"
              aria-label={`Learn more about air quality: ${label}`}
              className="text-sm font-medium border-2 px-6 py-2 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200 hover:scale-105"
              style={{
                borderColor: aqiColorInfo.gradient[0],
                color: aqiColorInfo.gradient[0]
              }}
            >
              <AQIIcon className="w-4 h-4 mr-2" aria-hidden="true" />
              Learn More
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}