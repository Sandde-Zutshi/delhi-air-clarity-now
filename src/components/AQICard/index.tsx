import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Activity, Info, X } from "lucide-react";
import { 
  getAQILevel, 
  getAQIColorClass, 
  getAQITextColorClass,
  AQILevel 
} from './constants';
import { 
  cardVariants, 
  iconVariants, 
  buttonVariants, 
  aqiNumberVariants,
  gradientVariants 
} from './animations';

interface AQICardProps {
  aqi: number;
  location?: string;
  className?: string;
  trend?: "up" | "down" | "stable";
  previousAqi?: number;
  onLearnMore?: (level: AQILevel) => void;
}

export function AQICard({ 
  aqi, 
  location = "Delhi", 
  className, 
  trend = "stable", 
  previousAqi,
  onLearnMore 
}: AQICardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const aqiLevel = getAQILevel(aqi);
  const colorClass = getAQIColorClass(aqi);
  const textColorClass = getAQITextColorClass(aqi);
  
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

  const handleLearnMore = () => {
    if (onLearnMore) {
      onLearnMore(aqiLevel);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <Card className={cn("border-0 glass-card overflow-hidden", className)}>
        <CardHeader className="pb-4 relative z-10">
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
        
        <CardContent className="space-y-6 relative">
          {/* Animated Protection Icon */}
          <motion.div
            className="absolute top-4 right-4 z-20"
            variants={iconVariants}
            initial="initial"
            animate="pulse"
            whileHover="hover"
            aria-hidden="true"
          >
            <div className="px-3 py-2 text-2xl flex items-center justify-center bg-white/80 shadow rounded-md">
              {aqiLevel.icon}
            </div>
          </motion.div>

          {/* Main AQI Display with Dynamic Gradient */}
          <div className="relative">
            <motion.div 
              className="rounded-2xl p-8 text-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${aqiLevel.gradient[0]}, ${aqiLevel.gradient[1]})`,
              }}
              variants={gradientVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              
              {/* AQI Number */}
              <motion.div 
                className="text-6xl font-bold mb-3 text-white drop-shadow-lg relative z-10"
                variants={aqiNumberVariants}
                initial="initial"
                animate="animate"
              >
                {aqi}
              </motion.div>
              
              {/* AQI Level */}
              <div className="text-xl font-medium text-white/95 mb-2 relative z-10">
                {aqiLevel.name}
              </div>
              
              {/* Description */}
              <div className="text-sm text-white/80 mb-4 relative z-10">
                {aqiLevel.description}
              </div>
              
              {/* Protection Level */}
              <div className="text-xs text-white/70 font-medium relative z-10">
                {aqiLevel.protectionLevel}
              </div>
              
              {/* Trend Information */}
              {previousAqi && (
                <motion.div 
                  className={cn("flex items-center justify-center gap-2 mt-3 text-sm", getTrendColor())}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {getTrendIcon()}
                  <span className="text-white/90">
                    {trend === "up" ? "+" : trend === "down" ? "-" : ""}
                    {Math.abs(aqi - previousAqi)} from last hour
                  </span>
                </motion.div>
              )}
            </motion.div>
            
            {/* Floating Gradient Orb */}
            <motion.div 
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-60"
              style={{
                background: `linear-gradient(135deg, ${aqiLevel.gradient[0]}, ${aqiLevel.gradient[1]})`,
              }}
              animate={{
                scale: isHovered ? 1.2 : 1,
                opacity: isHovered ? 0.8 : 0.6,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Learn More Button */}
          <motion.div className="flex justify-center">
            <motion.div
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                onClick={handleLearnMore}
                variant="outline"
                size="sm"
                className={cn(
                  "text-sm font-medium border-2 px-4 py-2",
                  `border-${colorClass}`,
                  `text-${colorClass}`,
                  "bg-background/50 backdrop-blur-sm hover:bg-background/80",
                  "transition-all duration-200"
                )}
                aria-label={`Learn more about protection for ${aqiLevel.name} air quality`}
              >
                <Info className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Update Badge */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Badge 
              variant="outline" 
              className={cn(
                "text-sm font-medium border px-3 py-1",
                `border-${colorClass}/30`,
                `text-${colorClass}`,
                "bg-background/30 backdrop-blur-sm"
              )}
            >
              <Activity className="w-3 h-3 mr-2" />
              Updated: {new Date().toLocaleTimeString()}
            </Badge>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 