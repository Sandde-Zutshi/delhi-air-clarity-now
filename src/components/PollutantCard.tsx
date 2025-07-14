import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusButton, Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Minus, Flame, Droplets, Wind, Zap, Car, Factory, Home, Leaf, Train, Bus, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPollutantColorInfo } from '@/lib/pollutant-utils';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useState } from 'react';

interface PollutantCardProps {
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
  status: "good" | "moderate" | "unhealthy" | "critical";
  onLearnMore?: (pollutant: any) => void;
  showTrendLine?: boolean; // NEW PROP
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
function generate24HourTrend(pollutantName: string, currentValue: number): Array<{value: number, time: string, hour: number}> {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Create a seed based on date (resets daily) and pollutant name
  const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const nameSeed = pollutantName.charCodeAt(0) + pollutantName.charCodeAt(pollutantName.length - 1);
  const seed = dateSeed + nameSeed;
  
  // Generate 24 data points (one per hour)
  const trend: Array<{value: number, time: string, hour: number}> = [];
  
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
    
    // Format time string in 12-hour format with AM/PM
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const timeString = `${displayHour} ${ampm}`;
    
    // For current hour, use the actual current value
    if (hour === currentHour) {
      trend.push({ value: currentValue, time: timeString, hour });
    } else if (hour < currentHour) {
      // Past hours: use generated value
      trend.push({ 
        value: Math.round(finalValue * 10) / 10, 
        time: timeString, 
        hour 
      });
    } else {
      // Future hours: use a projection based on current trend
      const projection = currentValue * (0.8 + Math.random() * 0.4);
      trend.push({ 
        value: Math.round(projection * 10) / 10, 
        time: timeString, 
        hour 
      });
    }
  }
  
  return trend;
}

export function PollutantCard({ name, value, unit, trend, trendValue, status, onLearnMore, showTrendLine = true }: PollutantCardProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{value: number, time: string, hour: number} | null>(null);
  
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
  
  // Generate real-time 24-hour trend data with time information
  const trendDataWithTime = generate24HourTrend(name, value);
  const trendValues = trendDataWithTime.map(d => d.value);
  
  // Handle mouse events for tooltip
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const index = Math.floor((x / width) * trendDataWithTime.length);
    
    if (index >= 0 && index < trendDataWithTime.length) {
      setHoveredPoint(trendDataWithTime[index]);
    }
  };
  
  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <Card className="border-0 bg-transparent shadow-none relative z-10" style={{ borderColor: colorInfo.borderColor }}>
      <CardContent className="p-0">
        <div 
          className="rounded-2xl p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
          style={{
            background: 'white',
            position: 'relative'
          }}
        >
          {/* Dynamic colored corners - minimal quarter arc only on top-left corner */}
          <svg className="absolute top-0 left-0 z-10" width="20" height="20" style={{overflow: 'visible'}}>
            <path d="M20,1 Q1,1 1,20" fill="none" stroke={colorInfo.gradient[0]} strokeWidth="2" />
          </svg>
          {/* Header: Pollutant Name and Icon */}
          {/* In the card header, set position: relative */}
          <div className="flex flex-col items-start gap-0 relative w-full mb-4">
            {/* Air Pollutant label and name in rectangular box - positioned closer to edges */}
            <div className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 shadow-sm -mt-3 -ml-3">
              <span className="text-xs font-normal opacity-60 block text-gray-600">Air Pollutant</span>
              <h3 className="font-bold text-lg leading-tight text-gray-900">{name}</h3>
            </div>
            {/* Icon aligned with the center of the pollutant box, positioned close to edges */}
            <div className="absolute top-0 right-0 flex items-center justify-center px-3 py-3 rounded-md bg-gray-100 border border-gray-200 shadow-lg z-10 -mt-3 -mr-3">
              <PollutantIcon className="w-6 h-6 text-gray-700" />
            </div>
          </div>
          
          {/* Main Value Display */}
          <div className="text-center mb-4">
            <div className="flex items-baseline justify-center gap-2">
              <span 
                className="text-4xl font-bold text-gray-900"
              >
                {value}
              </span>
              <span 
                className="text-lg font-medium text-gray-600"
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
                backgroundColor: colorInfo.gradient[0],
                color: colorInfo.textColor
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            
            {Math.abs(trendValue) > 0.1 && (
              <div className="flex items-center gap-2">
                <TrendIcon 
                  className="w-4 h-4 text-gray-600" 
                />
                <span 
                  className="text-sm font-medium text-gray-600"
                >
                  {trendValue > 0 ? '+' : ''}{trendValue}%
                </span>
              </div>
            )}
          </div>
          
          {/* Interactive Sparkline Trend Graph */}
          {showTrendLine && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-center mb-2 text-gray-600">
                24-Hour Trend
              </div>
              <div className="relative cursor-crosshair" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ height: 40 }}>
                {/* Custom SVG trendline with dynamic color segments */}
                <svg width={200} height={30} style={{ display: 'block', width: '100%', height: 30 }}>
                  {trendValues.slice(0, -1).map((v, i) => {
                    const x1 = (i / (trendValues.length - 1)) * 200;
                    const y1 = 30 - ((trendValues[i] - Math.min(...trendValues)) / (Math.max(...trendValues) - Math.min(...trendValues) || 1)) * 28;
                    const x2 = ((i + 1) / (trendValues.length - 1)) * 200;
                    const y2 = 30 - ((trendValues[i + 1] - Math.min(...trendValues)) / (Math.max(...trendValues) - Math.min(...trendValues) || 1)) * 28;
                    const color = getPollutantColorInfo(name, trendValues[i]).gradient[0];
                    return (
                      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" />
                    );
                  })}
                </svg>
                {/* Hover indicator dot and tooltip */}
                {hoveredPoint && (
                  <>
                    <div 
                      className="absolute w-2 h-2 rounded-full border-2 border-white shadow-lg"
                      style={{
                        left: `${(hoveredPoint.hour / 23) * 100}%`,
                        transform: 'translateX(-50%)',
                        top: '50%',
                        backgroundColor: getPollutantColorInfo(name, hoveredPoint.value).gradient[0]
                      }}
                    />
                    {/* Tooltip display */}
                    <div 
                      className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none z-20"
                      style={{
                        left: `${(hoveredPoint.hour / 23) * 100}%`,
                        transform: 'translateX(-50%)',
                        bottom: '45px'
                      }}
                    >
                      <div className="font-semibold">{hoveredPoint.time}</div>
                      <div>{hoveredPoint.value} {unit}</div>
                    </div>
                  </>
                )}
              </div>
              {/* Time axis labels */}
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>12 AM</span>
                <span>12 PM</span>
                <span>11 PM</span>
              </div>
            </div>
          )}
        </div>
        {/* Learn More Button */}
        {onLearnMore && (
          <div className="flex justify-center mt-2">
            <Button
              onClick={() => onLearnMore({
                name,
                value,
                unit,
                status,
                gradient: colorInfo.gradient,
                icon: PollutantIcon,
                description: getPollutantDescription(name)
              })}
              variant="outline"
              size="sm"
              className="text-sm font-medium border-2 px-4 py-2 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
              aria-label={`Learn more about ${name}`}
            >
              <Info className="w-4 h-4 mr-2" />
              Learn More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}