import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusButton, Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Minus, Flame, Droplets, Wind, Zap, Car, Factory, Home, Leaf, Train, Bus, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPollutantColorInfo } from '@/lib/pollutant-utils';
import { Sparklines, SparklinesLine } from 'react-sparklines';

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

// Generate realistic 24-hour trend data that resets at midnight
function generate24HourTrend(pollutantName: string, currentValue: number): number[] {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Create a seed based on date (resets daily) and pollutant name
  const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const nameSeed = pollutantName.charCodeAt(0) + pollutantName.charCodeAt(pollutantName.length - 1);
  const seed = dateSeed + nameSeed;
  
  // Generate 24 data points (one per hour)
  const trend: number[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    // Base value with daily pattern (higher during day, lower at night)
    let baseValue = currentValue;
    
    // Add daily variation pattern
    if (hour >= 6 && hour <= 18) {
      // Daytime: higher values (traffic, industrial activity)
      baseValue *= 1.2 + (Math.sin((hour - 6) * Math.PI / 12) * 0.3);
    } else {
      // Nighttime: lower values
      baseValue *= 0.7 + (Math.sin((hour - 18) * Math.PI / 12) * 0.2);
    }
    
    // Add some randomness based on seed and hour
    const randomFactor = 0.9 + (Math.sin(seed + hour * 7) * 0.2);
    const finalValue = Math.max(0, baseValue * randomFactor);
    
    // For current hour, use the actual current value
    if (hour === currentHour) {
      trend.push(currentValue);
    } else if (hour < currentHour) {
      // Past hours: use generated value
      trend.push(Math.round(finalValue * 10) / 10);
    } else {
      // Future hours: use a projection based on current trend
      const projection = currentValue * (0.8 + Math.random() * 0.4);
      trend.push(Math.round(projection * 10) / 10);
    }
  }
  
  return trend;
}

export function PollutantCard({ name, value, unit, trend, trendValue, status, onLearnMore }: PollutantCardProps) {
  if (value == null || isNaN(value)) {
    return (
      <div className="rounded-2xl p-6 text-center bg-muted/50 text-muted-foreground shadow-md min-h-[120px] flex flex-col items-center justify-center">
        <span className="text-lg font-bold mb-1">No Data</span>
        <span className="text-xs">No data available for {name} at this time.</span>
      </div>
    );
  }
  
  // Use new color system
  const colorInfo = getPollutantColorInfo(name, value);
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const PollutantIcon = getPollutantIcon(name);
  
  // Generate real-time 24-hour trend data
  const trendData = generate24HourTrend(name, value);
  
  return (
    <Card className="border-0 bg-transparent shadow-none relative z-10" style={{ borderColor: colorInfo.borderColor }}>
      <CardContent className="p-0">
        <div 
          className="rounded-2xl p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${colorInfo.gradient[0]}, ${colorInfo.gradient[1]})`,
            border: `2px solid ${colorInfo.borderColor}`
          }}
        >
          {/* Header: Pollutant Name and Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${colorInfo.textColor}20` }}
              >
                <PollutantIcon 
                  className="w-5 h-5" 
                  style={{ color: colorInfo.textColor }} 
                />
              </div>
              <div>
                <h3 
                  className="font-bold text-lg leading-tight"
                  style={{ color: colorInfo.textColor }}
                >
                  {name}
                </h3>
                <p 
                  className="text-xs opacity-80"
                  style={{ color: colorInfo.textColor }}
                >
                  Air Pollutant
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLearnMore?.({ name, value, unit, status })}
              className="opacity-70 hover:opacity-100 transition-opacity hover:bg-white/20"
              style={{ color: colorInfo.textColor }}
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Main Value Display */}
          <div className="text-center mb-4">
            <div className="flex items-baseline justify-center gap-2">
              <span 
                className="text-4xl font-bold"
                style={{ color: colorInfo.textColor }}
              >
                {value}
              </span>
              <span 
                className="text-lg font-medium opacity-80"
                style={{ color: colorInfo.textColor }}
              >
                {unit}
              </span>
            </div>
          </div>
          
          {/* Status and Trend Info */}
          <div className="flex items-center justify-between mb-4">
            <Badge 
              variant="secondary" 
              className="text-xs font-semibold px-3 py-1"
              style={{ 
                backgroundColor: colorInfo.textColor,
                color: colorInfo.hex
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            
            <div className="flex items-center gap-2">
              <TrendIcon 
                className="w-4 h-4" 
                style={{ color: colorInfo.textColor }} 
              />
              <span 
                className="text-sm font-medium"
                style={{ color: colorInfo.textColor }}
              >
                {trendValue ? `${trendValue}%` : 'No change'}
              </span>
            </div>
          </div>
          
          {/* Sparkline Trend Graph */}
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-center mb-2 opacity-80" style={{ color: colorInfo.textColor }}>
              24-Hour Trend
            </div>
            <Sparklines data={trendData} width={200} height={30} margin={5}>
              <SparklinesLine 
                style={{ 
                  stroke: colorInfo.textColor, 
                  strokeWidth: 2, 
                  fill: "none" 
                }} 
              />
            </Sparklines>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}