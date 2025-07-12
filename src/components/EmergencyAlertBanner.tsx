import React from 'react';
import { AlertTriangle, X, Phone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAQIColorInfo } from '@/lib/aqi-colors';

interface EmergencyAlertBannerProps {
  aqi: number;
  onDismiss?: () => void;
  onViewHealth?: () => void;
}

export function EmergencyAlertBanner({ aqi, onDismiss, onViewHealth }: EmergencyAlertBannerProps) {
  // Only show for unhealthy air quality (AQI > 150)
  if (aqi <= 150) {
    return null;
  }

  const colorInfo = getAQIColorInfo(aqi);
  const isEmergency = aqi > 300;

  const getEmergencyMessage = (aqi: number) => {
    if (aqi <= 200) return "Air quality is unhealthy. Limit outdoor activities.";
    if (aqi <= 300) return "Air quality is very unhealthy. Avoid outdoor activities.";
    return "EMERGENCY: Hazardous air quality. Stay indoors immediately.";
  };

  const getEmergencyTitle = (aqi: number) => {
    if (aqi <= 200) return "Unhealthy Air Quality Alert";
    if (aqi <= 300) return "Very Unhealthy Air Quality Alert";
    return "🚨 HAZARDOUS AIR QUALITY EMERGENCY 🚨";
  };

  return (
    <div 
      className="relative w-full py-2 px-4 text-white font-medium animate-pulse rounded-lg"
      style={{
        background: `linear-gradient(135deg, ${colorInfo.gradient[0]}, ${colorInfo.gradient[1]})`,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}
    >
      {/* Emergency overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: isEmergency ? 
            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' : 
            'none'
        }} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section: Icon and Title */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Emergency Icon */}
            <div className="flex-shrink-0">
              {isEmergency ? (
                <div className="animate-bounce">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              ) : (
                <AlertTriangle className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Alert Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold whitespace-nowrap">
                  {getEmergencyTitle(aqi)}
                </h2>
                {isEmergency && (
                  <div className="flex items-center gap-1 bg-red-600 px-2 py-1 rounded text-xs font-bold animate-pulse flex-shrink-0">
                    <Shield className="w-3 h-3" />
                    EMERGENCY
                  </div>
                )}
              </div>
              <p className="text-xs opacity-95 mt-1 truncate">
                {getEmergencyMessage(aqi)} AQI: {aqi}
              </p>
            </div>
          </div>

          {/* Right Section: Contacts and Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Emergency Contacts */}
            <div className="hidden md:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 whitespace-nowrap">
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span>SOS: 112</span>
              </div>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <span>Ambulance: 102</span>
              </div>
            </div>

            {/* Health Guidance Button */}
            {onViewHealth && (
              <Button
                onClick={onViewHealth}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs px-3 py-1 whitespace-nowrap"
              >
                Health Guide
              </Button>
            )}

            {/* Dismiss Button */}
            {onDismiss && (
              <Button
                onClick={onDismiss}
                size="sm"
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 p-1 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Emergency Contacts */}
        <div className="md:hidden mt-2 pt-2 border-t border-white/20">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>SOS: 112</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Ambulance: 102</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Police: 100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 