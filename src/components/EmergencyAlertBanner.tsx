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
      className="relative w-full py-4 px-6 text-white font-medium animate-pulse"
      style={{
        background: `linear-gradient(135deg, ${colorInfo.gradient[0]}, ${colorInfo.gradient[1]})`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
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

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Emergency Icon */}
            <div className="flex items-center gap-2">
              {isEmergency ? (
                <div className="animate-bounce">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              ) : (
                <AlertTriangle className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Alert Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">
                  {getEmergencyTitle(aqi)}
                </h2>
                {isEmergency && (
                  <div className="flex items-center gap-1 bg-red-600 px-2 py-1 rounded text-xs font-bold animate-pulse">
                    <Shield className="w-3 h-3" />
                    EMERGENCY
                  </div>
                )}
              </div>
              <p className="text-sm opacity-95 mt-1">
                {getEmergencyMessage(aqi)} AQI: {aqi}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Emergency Contacts */}
            <div className="hidden md:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>SOS: 112</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Ambulance: 102</span>
              </div>
            </div>

            {/* Health Guidance Button */}
            {onViewHealth && (
              <Button
                onClick={onViewHealth}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                View Health Guidance
              </Button>
            )}

            {/* Dismiss Button */}
            {onDismiss && (
              <Button
                onClick={onDismiss}
                size="sm"
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Emergency Contacts */}
        <div className="md:hidden mt-3 pt-3 border-t border-white/20">
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