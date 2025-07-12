import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusButton, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Activity, Wind, CloudRain, Sun, AlertTriangle, Skull } from "lucide-react";
import { getAQIColorInfo, getAQILevel, getHealthImplications, getCautionStatement } from "@/lib/aqi-colors";
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useState, useRef, useId } from 'react';
import { useAQICardHover } from './AQICardHoverContext';

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
function generate24HourAQITrend(currentAQI: number): Array<{value: number, time: string, hour: number}> {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Create a seed based on date (resets daily)
  const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const seed = dateSeed;
  
  // Generate 24 data points (one per hour)
  const trend: Array<{value: number, time: string, hour: number}> = [];
  
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
    
    // Format time string in 12-hour format with AM/PM
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const timeString = `${displayHour} ${ampm}`;
    
    // For current hour, use the actual current value
    if (hour === currentHour) {
      trend.push({ value: currentAQI, time: timeString, hour });
    } else if (hour < currentHour) {
      // Past hours: use generated value
      trend.push({ 
        value: Math.round(finalValue), 
        time: timeString, 
        hour 
      });
    } else {
      // Future hours: use a projection based on current trend
      const projection = currentAQI * (0.8 + Math.random() * 0.4);
      trend.push({ 
        value: Math.round(projection), 
        time: timeString, 
        hour 
      });
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

// Utility to darken a hex color
function darkenColor(hex: string, amount = 0.2) {
  let col = hex.replace('#', '');
  if (col.length === 3) col = col.split('').map(x => x + x).join('');
  const num = parseInt(col, 16);
  let r = Math.max(0, ((num >> 16) & 0xff) * (1 - amount));
  let g = Math.max(0, ((num >> 8) & 0xff) * (1 - amount));
  let b = Math.max(0, (num & 0xff) * (1 - amount));
  return `rgb(${r},${g},${b})`;
}

export function AQICard({ aqi, location = "Delhi", className, trend = "stable", previousAqi, onLearnMore, source, aqiLevel, healthImplications }: AQICardProps) {
  const cardId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const { activeCardId, hoveredPoint, setActiveCard } = useAQICardHover();
  
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
  
  // Generate 24-hour AQI trend data with time information
  const trendDataWithTime = generate24HourAQITrend(aqi);
  const trendValues = trendDataWithTime.map(d => d.value);
  
  // Handle mouse events for tooltip
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const index = Math.round((x / width) * (trendDataWithTime.length - 1));
    if (index >= 0 && index < trendDataWithTime.length) {
      setActiveCard(cardId, trendDataWithTime[index]);
    }
  };
  
  const handleMouseLeave = () => {
    setActiveCard(cardId, null);
  };
  
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
            {/* AQI Value Display */}
            <div className="text-6xl font-bold mb-2 animate-scale-in">{aqi}</div>
            <div className="text-2xl font-semibold mb-3 opacity-95">{label}</div>
            <div className="text-base font-medium opacity-90 mb-4">{displayDescription}</div>
            

            
            {previousAqi && (
              <div className={cn("flex items-center justify-center gap-2 mb-4 text-sm", getTrendColor())}>
                {getTrendIcon()}
                <span>
                  {trend === "up" ? "+" : trend === "down" ? "-" : ""}
                  {Math.abs(aqi - previousAqi)} from last hour
                </span>
              </div>
            )}
            
            {/* Interactive 24-Hour AQI Trend Graph */}
            <div className="bg-white/10 rounded-lg p-3 border border-white/20">
              <div className="text-xs text-center mb-2 opacity-80">
                24-Hour AQI Trend
              </div>
              
              {/* Tooltip display */}
              {hoveredPoint && (
                <div 
                  className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none z-20"
                  style={{
                    left: `${(hoveredPoint.hour / 23) * 100}%`,
                    transform: 'translateX(-50%)',
                    bottom: '45px'
                  }}
                >
                  <div className="font-semibold">{hoveredPoint.time}</div>
                  <div>AQI: {hoveredPoint.value}</div>
                </div>
              )}
              
              <div 
                className="relative cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ height: 40 }}
              >
                {/* Custom SVG trendline with dynamic color segments */}
                <svg ref={svgRef} width={280} height={35} style={{ display: 'block', width: '100%', height: 35 }} aria-labelledby={`aqi-trend-${cardId}`}>
                  {trendValues.slice(0, -1).map((v, i) => {
                    const x1 = (i / (trendValues.length - 1)) * 280;
                    const y1 = 35 - ((trendValues[i] - Math.min(...trendValues)) / (Math.max(...trendValues) - Math.min(...trendValues) || 1)) * 33;
                    const x2 = ((i + 1) / (trendValues.length - 1)) * 280;
                    const y2 = 35 - ((trendValues[i + 1] - Math.min(...trendValues)) / (Math.max(...trendValues) - Math.min(...trendValues) || 1)) * 33;
                    const color = getAQIColorInfo(trendValues[i]).gradient[0];
                    return (
                      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" />
                    );
                  })}
                </svg>
                {/* Only one hover indicator dot and tooltip, outside the SVG/map, with unique cardId */}
                {activeCardId === cardId && hoveredPoint && (
                  <div key={`tooltip-dot-${cardId}`}> 
                    <div 
                      className="absolute w-2 h-2 rounded-full border-2 border-white shadow-lg"
                      style={{
                        left: `${(hoveredPoint.hour / 23) * 100}%`,
                        transform: 'translateX(-50%)',
                        top: '50%',
                        backgroundColor: getAQIColorInfo(hoveredPoint.value).gradient[0]
                      }}
                    />
                    <div 
                      className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none z-20"
                      style={{
                        left: `${(hoveredPoint.hour / 23) * 100}%`,
                        transform: 'translateX(-50%)',
                        bottom: '45px'
                      }}
                    >
                      <div className="font-semibold">{hoveredPoint.time}</div>
                      <div>AQI: {hoveredPoint.value}</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Time axis labels */}
              <div className="flex justify-between text-xs opacity-60 mt-1">
                <span>12 AM</span>
                <span>12 PM</span>
                <span>11 PM</span>
              </div>
            </div>
          </div>
          
          {/* AQI Icon in top right corner */}
          <div className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 border border-white/30 shadow-lg">
            <AQIIcon className="w-6 h-6 text-white opacity-90" />
          </div>
          {/* Dynamic colored corners - minimal quarter arcs (touching the card) */}
          {/* Top-left corner */}
          <svg className="absolute top-0 left-0 z-10" width="20" height="20" style={{overflow: 'visible'}}>
            <path d="M20,1 Q1,1 1,20" fill="none" stroke={darkenColor(aqiColorInfo.gradient[0], 0.18)} strokeWidth="2" />
          </svg>
          {/* Top-right corner */}
          <svg className="absolute top-0 right-0 z-10" width="20" height="20" style={{overflow: 'visible'}}>
            <path d="M0,1 Q19,1 19,20" fill="none" stroke={darkenColor(aqiColorInfo.gradient[0], 0.18)} strokeWidth="2" />
          </svg>
          {/* Bottom-left corner */}
          <svg className="absolute bottom-0 left-0 z-10" width="20" height="20" style={{overflow: 'visible'}}>
            <path d="M20,19 Q1,19 1,0" fill="none" stroke={darkenColor(aqiColorInfo.gradient[0], 0.18)} strokeWidth="2" />
          </svg>
          {/* Bottom-right corner */}
          <svg className="absolute bottom-0 right-0 z-10" width="20" height="20" style={{overflow: 'visible'}}>
            <path d="M0,19 Q19,19 19,0" fill="none" stroke={darkenColor(aqiColorInfo.gradient[0], 0.18)} strokeWidth="2" />
          </svg>
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