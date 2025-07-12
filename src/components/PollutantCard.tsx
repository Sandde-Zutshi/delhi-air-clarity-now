import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PollutantCardProps {
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
  status: "good" | "moderate" | "unhealthy" | "critical";
}

const statusConfig = {
  good: { 
    color: "#10B981", 
    icon: "text-green-600",
    gradient: ["#10B981", "#059669"]
  },
  moderate: { 
    color: "#F59E0B", 
    icon: "text-yellow-600",
    gradient: ["#F59E0B", "#D97706"]
  },
  unhealthy: { 
    color: "#F97316", 
    icon: "text-orange-600",
    gradient: ["#F97316", "#EA580C"]
  },
  critical: { 
    color: "#EF4444", 
    icon: "text-red-600",
    gradient: ["#EF4444", "#DC2626"]
  }
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus
};

export function PollutantCard({ name, value, unit, trend, trendValue, status }: PollutantCardProps) {
  const config = statusConfig[status];
  const TrendIcon = trendIcons[trend];
  
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow min-w-[200px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          {name}
          <div 
            className="w-3 h-3 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${config.gradient[0]}, ${config.gradient[1]})`
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-2xl font-bold">
          {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendIcon className={cn("w-4 h-4", config.icon)} />
          <span className="text-sm text-muted-foreground">
            {trend === "stable" ? "No change" : `${trendValue}% ${trend === "up" ? "increase" : "decrease"}`}
          </span>
        </div>

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
      </CardContent>
    </Card>
  );
}