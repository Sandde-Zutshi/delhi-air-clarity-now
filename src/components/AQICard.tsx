import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusButton, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Activity, Wind, CloudRain, Sun, AlertTriangle, Skull } from "lucide-react";

interface AQICardProps {
  aqi: number;
  location?: string;
  className?: string;
  trend?: "up" | "down" | "stable";
  previousAqi?: number;
  onLearnMore?: (level: any) => void;
}

const OWM_AQI_MAP = {
  1: { label: "Good", color: "#10B981", gradient: ["#10B981", "#059669"], icon: Sun, description: "Air quality is considered satisfactory, and air pollution poses little or no risk." },
  2: { label: "Fair", color: "#22d3ee", gradient: ["#22d3ee", "#06b6d4"], icon: Wind, description: "Air quality is acceptable; some pollutants may be a concern for a very small number of people." },
  3: { label: "Moderate", color: "#f59e42", gradient: ["#f59e42", "#fbbf24"], icon: CloudRain, description: "Air quality is acceptable; however, there may be a moderate health concern for a very small number of people." },
  4: { label: "Poor", color: "#ef4444", gradient: ["#ef4444", "#dc2626"], icon: AlertTriangle, description: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects." },
  5: { label: "Very Poor", color: "#991b1b", gradient: ["#991b1b", "#7f1d1d"], icon: Skull, description: "Health warnings of emergency conditions. The entire population is more likely to be affected." }
};

export function AQICard({ aqi, location = "Delhi", className, trend = "stable", previousAqi, onLearnMore }: AQICardProps) {
  if (!aqi || aqi < 1 || aqi > 5) {
    return (
      <div className={cn("rounded-2xl p-8 text-center bg-muted/50 text-muted-foreground shadow-lg min-h-[180px] flex flex-col items-center justify-center", className)}>
        <span className="text-2xl font-bold mb-2">No AQI Data</span>
        <span className="text-sm">Air quality data is currently unavailable for this location.</span>
      </div>
    );
  }
  const aqiInfo = OWM_AQI_MAP[aqi] || OWM_AQI_MAP[1];
  const { label, color, gradient, icon: AQIIcon, description } = aqiInfo;
  
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
              background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
            }}
          >
            {/* Background Icon */}
            <div className="absolute top-4 right-4 opacity-20">
              <AQIIcon className="w-16 h-16" />
            </div>
            
            {/* AQI Value Display */}
            <div className="text-6xl font-bold mb-2 animate-scale-in">{aqi}</div>
            <div className="text-2xl font-semibold mb-3 opacity-95">{label}</div>
            <div className="text-base font-medium opacity-90 mb-2">{description}</div>
            
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
              background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
            }}
          />
        </div>
        <div className="flex justify-center">
          {onLearnMore && (
            <Button
              onClick={() => onLearnMore({ 
                name: label, 
                range: [0, 0], 
                gradient: gradient, 
                icon: AQIIcon, 
                description: description, 
                protectionLevel: label 
              })}
              variant="outline"
              size="sm"
              aria-label={`Learn more about air quality: ${label}`}
              className="text-sm font-medium border-2 px-6 py-2 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200 hover:scale-105"
              style={{
                borderColor: gradient[0],
                color: gradient[0]
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