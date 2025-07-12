import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const getAQILevel = (aqi: number) => {
  if (aqi <= 50) return { 
    level: "Good", 
    color: "aqi-good", 
    textColor: "aqi-good-foreground",
    gradient: ["#10B981", "#059669"],
    icon: Sun,
    description: "Air quality is considered satisfactory, and air pollution poses little or no risk."
  };
  if (aqi <= 100) return { 
    level: "Moderate", 
    color: "aqi-moderate", 
    textColor: "aqi-moderate-foreground",
    gradient: ["#F59E0B", "#D97706"],
    icon: Wind,
    description: "Air quality is acceptable; however, some pollutants may be a concern for a small number of people."
  };
  if (aqi <= 150) return { 
    level: "Unhealthy for Sensitive Groups", 
    color: "aqi-unhealthy-sensitive", 
    textColor: "aqi-unhealthy-sensitive-foreground",
    gradient: ["#F97316", "#EA580C"],
    icon: CloudRain,
    description: "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
  };
  if (aqi <= 200) return { 
    level: "Unhealthy", 
    color: "aqi-unhealthy", 
    textColor: "aqi-unhealthy-foreground",
    gradient: ["#EF4444", "#DC2626"],
    icon: AlertTriangle,
    description: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects."
  };
  if (aqi <= 300) return { 
    level: "Very Unhealthy", 
    color: "aqi-very-unhealthy", 
    textColor: "aqi-very-unhealthy-foreground",
    gradient: ["#8B5CF6", "#7C3AED"],
    icon: AlertTriangle,
    description: "Health warnings of emergency conditions. The entire population is more likely to be affected."
  };
  return { 
    level: "Hazardous", 
    color: "aqi-hazardous", 
    textColor: "aqi-hazardous-foreground",
    gradient: ["#991B1B", "#7F1D1D"],
    icon: Skull,
    description: "Health alert: everyone may experience more serious health effects."
  };
};

export function AQICard({ aqi, location = "Delhi", className, trend = "stable", previousAqi, onLearnMore }: AQICardProps) {
  const { level, color, textColor, gradient, icon: AQIIcon, description } = getAQILevel(aqi);
  
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
            
            <div className="text-6xl font-bold mb-3 animate-scale-in">{aqi}</div>
            <div className="text-xl font-medium opacity-95">{level}</div>
            
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
        
        <div className="flex justify-center gap-3">
          {onLearnMore && (
            <Button
              onClick={() => onLearnMore({ 
                name: level, 
                range: [0, 0], 
                gradient: gradient, 
                icon: AQIIcon, 
                description: description, 
                protectionLevel: level 
              })}
              variant="outline"
              size="sm"
              className="text-sm font-medium border-2 px-6 py-2 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200 hover:scale-105"
              style={{
                borderColor: gradient[0],
                color: gradient[0]
              }}
            >
              <AQIIcon className="w-4 h-4 mr-2" />
              Learn More
            </Button>
          )}
          <Badge 
            variant="outline" 
            className="text-sm font-medium border-2 px-4 py-2 animate-fade-in bg-background/50 backdrop-blur-sm"
            style={{
              borderColor: gradient[0],
              color: gradient[0]
            }}
          >
            <Activity className="w-3 h-3 mr-2" />
            Updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}