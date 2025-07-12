import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, Flame, Droplets, Wind, Zap, Car, Factory } from "lucide-react";
import { cn } from "@/lib/utils";

interface PollutantCardProps {
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
  status: "good" | "moderate" | "unhealthy" | "critical";
  onLearnMore?: (pollutant: any) => void;
}

const getPollutantIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('pm2.5') || lowerName.includes('pm10')) return Flame;
  if (lowerName.includes('no2')) return Car;
  if (lowerName.includes('so2')) return Factory;
  if (lowerName.includes('o3')) return Wind;
  if (lowerName.includes('co')) return Zap;
  return Droplets;
};

const getPollutantDescription = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('pm2.5')) return "Fine particulate matter that can penetrate deep into the lungs and bloodstream.";
  if (lowerName.includes('pm10')) return "Coarse particulate matter that can irritate the eyes, nose, and throat.";
  if (lowerName.includes('no2')) return "Nitrogen dioxide, primarily from vehicle emissions and power plants.";
  if (lowerName.includes('so2')) return "Sulfur dioxide, mainly from burning fossil fuels in power plants.";
  if (lowerName.includes('o3')) return "Ground-level ozone, formed by chemical reactions between pollutants in sunlight.";
  if (lowerName.includes('co')) return "Carbon monoxide, a colorless, odorless gas from incomplete combustion.";
  return "Air pollutant that can affect human health and the environment.";
};

const statusConfig = {
  good: { 
    color: "#10B981", 
    icon: "text-green-600",
    gradient: ["#10B981", "#059669"],
    description: "Safe levels"
  },
  moderate: { 
    color: "#F59E0B", 
    icon: "text-yellow-600",
    gradient: ["#F59E0B", "#D97706"],
    description: "Moderate concern"
  },
  unhealthy: { 
    color: "#F97316", 
    icon: "text-orange-600",
    gradient: ["#F97316", "#EA580C"],
    description: "Health effects possible"
  },
  critical: { 
    color: "#EF4444", 
    icon: "text-red-600",
    gradient: ["#EF4444", "#DC2626"],
    description: "Serious health risk"
  }
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus
};

export function PollutantCard({ name, value, unit, trend, trendValue, status, onLearnMore }: PollutantCardProps) {
  const config = statusConfig[status];
  const TrendIcon = trendIcons[trend];
  const PollutantIcon = getPollutantIcon(name);
  const description = getPollutantDescription(name);
  
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-[200px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PollutantIcon className="w-4 h-4" />
            {name}
          </div>
          <div 
            className="w-3 h-3 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${config.gradient[0]}, ${config.gradient[1]})`
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold">
          {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendIcon className={cn("w-4 h-4", config.icon)} />
          <span className="text-sm text-muted-foreground">
            {trend === "stable" ? "No change" : `${trendValue}% ${trend === "up" ? "increase" : "decrease"}`}
          </span>
        </div>

        <div className="space-y-2">
          <Badge 
            variant="outline" 
            className="w-full justify-center text-xs"
            style={{
              borderColor: config.color,
              color: config.color
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          
          {onLearnMore && (
            <Button
              onClick={() => onLearnMore({ 
                name: name, 
                value: value, 
                unit: unit, 
                status: status, 
                description: description,
                icon: PollutantIcon,
                gradient: config.gradient
              })}
              variant="outline"
              size="sm"
              className="w-full text-xs font-medium border px-3 py-1 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
              style={{
                borderColor: config.color,
                color: config.color
              }}
            >
              <PollutantIcon className="w-3 h-3 mr-1" />
              Learn More
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}