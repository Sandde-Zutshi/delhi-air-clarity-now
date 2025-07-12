import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Activity, Clock, Database, RefreshCw } from "lucide-react";
import { StationData } from '@/lib/delhi-station-api';
import { cn } from "@/lib/utils";

interface StationDataCardProps {
  station: StationData;
  isSelected?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
}

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return "text-green-600 bg-green-100";
  if (aqi <= 100) return "text-yellow-600 bg-yellow-100";
  if (aqi <= 150) return "text-orange-600 bg-orange-100";
  if (aqi <= 200) return "text-red-600 bg-red-100";
  if (aqi <= 300) return "text-purple-600 bg-purple-100";
  return "text-red-800 bg-red-200";
};

const getAQIBackground = (aqi: number) => {
  if (aqi <= 50) return "bg-green-50 border-green-200";
  if (aqi <= 100) return "bg-yellow-50 border-yellow-200";
  if (aqi <= 150) return "bg-orange-50 border-orange-200";
  if (aqi <= 200) return "bg-red-50 border-red-200";
  if (aqi <= 300) return "bg-purple-50 border-purple-200";
  return "bg-red-100 border-red-300";
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'WAQI':
      return <Database className="w-4 h-4 text-blue-600" />;
    case 'OpenAQ':
      return <Activity className="w-4 h-4 text-green-600" />;
    default:
      return <Activity className="w-4 h-4 text-gray-600" />;
  }
};

const getStationTypeIcon = (type: string) => {
  switch (type) {
    case 'government':
      return <MapPin className="w-4 h-4 text-blue-600" />;
    case 'research':
      return <Activity className="w-4 h-4 text-purple-600" />;
    case 'community':
      return <MapPin className="w-4 h-4 text-green-600" />;
    default:
      return <MapPin className="w-4 h-4 text-gray-600" />;
  }
};

export function StationDataCard({ station, isSelected = false, onClick, showDetails = false }: StationDataCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer",
        getAQIBackground(station.aqi),
        isSelected && "ring-2 ring-primary shadow-lg"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {getStationTypeIcon(station.stationType)}
            {station.name}
            <Badge variant="outline" className="text-xs">
              {station.stationType}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            {getSourceIcon(station.source)}
            <Badge variant="secondary" className="text-xs">
              {station.source}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {station.location}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* AQI Display */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {station.aqi}
            </div>
            <div className="text-sm text-muted-foreground">AQI</div>
          </div>
          <div className="text-right">
            <Badge className={cn("text-sm font-medium", getAQIColor(station.aqi))}>
              {station.aqiLevel}
            </Badge>
            <div className="text-xs text-muted-foreground mt-1">
              {station.aqi <= 50 && "Good air quality"}
              {station.aqi > 50 && station.aqi <= 100 && "Moderate air quality"}
              {station.aqi > 100 && station.aqi <= 150 && "Unhealthy for sensitive groups"}
              {station.aqi > 150 && station.aqi <= 200 && "Unhealthy air quality"}
              {station.aqi > 200 && station.aqi <= 300 && "Very unhealthy air quality"}
              {station.aqi > 300 && "Hazardous air quality"}
            </div>
          </div>
        </div>

        {/* Pollutants (if showDetails is true) */}
        {showDetails && station.pollutants && (
          <div className="space-y-2 mb-4">
            <div className="text-sm font-medium text-muted-foreground">Pollutants</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {station.pollutants.pm2_5 && (
                <div className="flex justify-between">
                  <span>PM2.5:</span>
                  <span className="font-medium">{station.pollutants.pm2_5} μg/m³</span>
                </div>
              )}
              {station.pollutants.pm10 && (
                <div className="flex justify-between">
                  <span>PM10:</span>
                  <span className="font-medium">{station.pollutants.pm10} μg/m³</span>
                </div>
              )}
              {station.pollutants.no2 && (
                <div className="flex justify-between">
                  <span>NO₂:</span>
                  <span className="font-medium">{station.pollutants.no2} μg/m³</span>
                </div>
              )}
              {station.pollutants.o3 && (
                <div className="flex justify-between">
                  <span>O₃:</span>
                  <span className="font-medium">{station.pollutants.o3} μg/m³</span>
                </div>
              )}
              {station.pollutants.co && (
                <div className="flex justify-between">
                  <span>CO:</span>
                  <span className="font-medium">{station.pollutants.co} μg/m³</span>
                </div>
              )}
              {station.pollutants.so2 && (
                <div className="flex justify-between">
                  <span>SO₂:</span>
                  <span className="font-medium">{station.pollutants.so2} μg/m³</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Updated: {formatTime(station.lastUpdated)}</span>
          </div>
          <div>{formatDate(station.lastUpdated)}</div>
        </div>

        {/* Warning for high AQI */}
        {station.aqi > 150 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-medium">
                {station.aqi > 300 ? "Hazardous conditions" : 
                 station.aqi > 200 ? "Very unhealthy conditions" : 
                 "Unhealthy conditions"} - Take precautions
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Station List Component
interface StationListProps {
  stations: StationData[];
  selectedStation?: StationData | null;
  onStationSelect: (station: StationData) => void;
  title?: string;
  showDetails?: boolean;
}

export function StationList({ stations, selectedStation, onStationSelect, title = "Delhi Monitoring Stations", showDetails = false }: StationListProps) {
  if (stations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">No station data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="outline">{stations.length} stations</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <StationDataCard
            key={station.id}
            station={station}
            isSelected={selectedStation?.id === station.id}
            onClick={() => onStationSelect(station)}
            showDetails={showDetails}
          />
        ))}
      </div>
    </div>
  );
} 