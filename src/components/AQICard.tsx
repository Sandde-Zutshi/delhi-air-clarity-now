import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

interface AQICardProps {
  aqi: number;
  location?: string;
  className?: string;
  trend?: "up" | "down" | "stable";
  previousAqi?: number;
}

const getAQILevel = (aqi: number) => {
  if (aqi <= 50) return { level: "Good", color: "aqi-good", textColor: "aqi-good-foreground" };
  if (aqi <= 100) return { level: "Moderate", color: "aqi-moderate", textColor: "aqi-moderate-foreground" };
  if (aqi <= 150) return { level: "Unhealthy for Sensitive Groups", color: "aqi-unhealthy-sensitive", textColor: "aqi-unhealthy-sensitive-foreground" };
  if (aqi <= 200) return { level: "Unhealthy", color: "aqi-unhealthy", textColor: "aqi-unhealthy-foreground" };
  if (aqi <= 300) return { level: "Very Unhealthy", color: "aqi-very-unhealthy", textColor: "aqi-very-unhealthy-foreground" };
  return { level: "Hazardous", color: "aqi-hazardous", textColor: "aqi-hazardous-foreground" };
};

export function AQICard({ aqi, location = "Delhi", className, trend = "stable", previousAqi }: AQICardProps) {
  const { level, color, textColor } = getAQILevel(aqi);
  
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
            className={cn(
              "rounded-2xl p-8 text-center transition-all duration-500 hover-scale",
              `bg-${color}`,
              `text-${textColor}`,
              "shadow-lg"
            )}
          >
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
            className={cn(
              "absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-60 animate-bounce-subtle",
              `bg-${color}`
            )}
          />
        </div>
        
        <div className="flex justify-center">
          <Badge 
            variant="outline" 
            className={cn(
              "text-sm font-medium border-2 px-4 py-2 animate-fade-in",
              `border-${color}`,
              `text-${color}`,
              "bg-background/50 backdrop-blur-sm"
            )}
          >
            <Activity className="w-3 h-3 mr-2" />
            Updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}