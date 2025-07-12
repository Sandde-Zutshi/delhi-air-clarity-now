import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusButton, Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Minus, Flame, Droplets, Wind, Zap, Car, Factory, Home, Leaf, Train, Bus } from "lucide-react";
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

// Utility to get the most common source icon and label for each pollutant
const getPollutantSource = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('pm2.5')) return { icon: Flame, label: 'Combustion (vehicles, stubble burning, wood, etc.)' };
  if (lowerName.includes('pm10')) return { icon: Factory, label: 'Construction, road dust, industry' };
  if (lowerName.includes('no2')) return { icon: Car, label: 'Vehicle emissions' };
  if (lowerName.includes('so2')) return { icon: Factory, label: 'Coal power plants, industry' };
  if (lowerName.includes('o3')) return { icon: Wind, label: 'Photochemical reactions (sunlight + pollution)' };
  if (lowerName.includes('co')) return { icon: Home, label: 'Incomplete combustion (homes, vehicles)' };
  return { icon: Leaf, label: 'General air pollutant' };
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
  if (value == null || isNaN(value)) {
    return (
      <div className="rounded-2xl p-6 text-center bg-muted/50 text-muted-foreground shadow-md min-h-[120px] flex flex-col items-center justify-center">
        <span className="text-lg font-bold mb-1">No Data</span>
        <span className="text-xs">No data available for {name} at this time.</span>
      </div>
    );
  }
  const config = statusConfig[status];
  const TrendIcon = trendIcons[trend];
  const PollutantIcon = getPollutantIcon(name);
  const description = getPollutantDescription(name);
  const source = getPollutantSource(name);
  // Dynamic gradient background style
  const cardGradient: React.CSSProperties = {
    background: `linear-gradient(135deg, ${config.gradient[0]}, ${config.gradient[1]})`,
    position: 'relative',
    overflow: 'hidden',
  };
  // Overlay for readability
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255,255,255,0.75)',
    zIndex: 0,
    pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
    borderRadius: '1rem',
  };
  return (
    <TooltipProvider>
      <div style={cardGradient} className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[200px] group">
        <span style={overlayStyle} />
        <Card className="border-0 bg-transparent shadow-none relative z-10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <div className="flex items-center gap-1 pl-1 font-semibold text-base">{name}</div>
              {/* Top-right: Source icon with tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/40 border border-white/60 shadow-sm">
                    <source.icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-xs font-medium">Most common source:</span><br />
                  {source.label}
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">
              {value && value > 0 ? (
                <>
                  {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">No Data</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <TrendIcon className={cn("w-4 h-4", config.icon)} />
              <span className="text-sm text-muted-foreground">
                {trend === "stable" ? "No change" : `${trendValue}% ${trend === "up" ? "increase" : "decrease"}`}
              </span>
            </div>
            <div className="space-y-2">
              <StatusButton 
                color={config.color}
                widthFull
                aria-label={`Pollutant status: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </StatusButton>
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
                  aria-label={`Learn more about pollutant: ${name}`}
                  className="w-full text-xs font-medium border px-3 py-1 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
                  style={{
                    borderColor: config.color,
                    color: config.color
                  }}
                >
                  <PollutantIcon className="w-3 h-3 mr-1" aria-hidden="true" />
                  Learn More
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}