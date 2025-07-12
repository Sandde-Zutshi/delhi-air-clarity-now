import { AQICard } from "@/components/AQICard";
import { PollutantCard } from "@/components/PollutantCard";
import { RecommendationsCard } from "@/components/RecommendationsCard";
import { DelhiAQIMap } from "@/components/DelhiAQIMap";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ProtectionModal } from "@/components/ProtectionModal";
import { LocationSearch } from "@/components/LocationSearch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Wifi, Zap, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AQILevel } from "@/components/AQICard/constants";
import { useAQI } from "@/hooks/useAQI";

// Helper function to get pollutant status based on value
const getPollutantStatus = (name: string, value: number): "good" | "moderate" | "unhealthy" | "critical" => {
  const thresholds = {
    "PM2.5": { good: 12, moderate: 35.4, unhealthy: 55.4 },
    "PM10": { good: 54, moderate: 154, unhealthy: 254 },
    "NO2": { good: 53, moderate: 100, unhealthy: 360 },
    "CO": { good: 4.4, moderate: 9.4, unhealthy: 12.4 },
    "O3": { good: 54, moderate: 70, unhealthy: 125 },
    "SO2": { good: 35, moderate: 75, unhealthy: 185 }
  };
  
  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return "moderate";
  
  if (value <= threshold.good) return "good";
  if (value <= threshold.moderate) return "moderate";
  if (value <= threshold.unhealthy) return "unhealthy";
  return "critical";
};

// Helper function to get trend
const getTrend = (current: number, previous: number): "up" | "down" | "stable" => {
  const diff = current - previous;
  if (Math.abs(diff) < 5) return "stable";
  return diff > 0 ? "up" : "down";
};

const Index = () => {
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "reconnecting" | "offline">("connected");
  const [protectionModalOpen, setProtectionModalOpen] = useState(false);
  const [selectedAQILevel, setSelectedAQILevel] = useState<AQILevel | null>(null);
  const [selectedPollutant, setSelectedPollutant] = useState<any>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [selectedAQIValue, setSelectedAQIValue] = useState<number | undefined>(undefined);
  
  // Use real AQI data
  const {
    data: aqiData,
    loading: isLoading,
    error,
    location,
    lastFetch,
    fetchByCity,
    fetchCurrentLocation,
    refresh
  } = useAQI({ initialLocation: 'Delhi', autoRefresh: true, refreshInterval: 300000 });

  useEffect(() => {
    // Simulate connection status changes
    const statusTimer = setInterval(() => {
      const statuses: typeof connectionStatus[] = ["connected", "reconnecting", "offline"];
      const weights = [0.85, 0.1, 0.05]; // 85% connected, 10% reconnecting, 5% offline
      const random = Math.random();
      let sum = 0;
      
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random <= sum) {
          setConnectionStatus(statuses[i]);
          break;
        }
      }
    }, 8000);
    
    return () => {
      clearInterval(statusTimer);
    };
  }, []);
  
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected": return <Wifi className="w-4 h-4 text-green-500" />;
      case "reconnecting": return <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case "offline": return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };
  
  const getConnectionText = () => {
    switch (connectionStatus) {
      case "connected": return "Live Data";
      case "reconnecting": return "Reconnecting...";
      case "offline": return "Offline";
    }
  };

  const handleLearnMore = (level: AQILevel) => {
    setSelectedAQILevel(level);
    setSelectedAQIValue(aqiData?.aqi);
    setProtectionModalOpen(true);
  };

  const handlePollutantLearnMore = (pollutant: any) => {
    setSelectedPollutant(pollutant);
    setProtectionModalOpen(true);
  };

  const handleRecommendationLearnMore = (recommendation: any) => {
    setSelectedRecommendation(recommendation);
    setProtectionModalOpen(true);
  };

  const handleLocationSelect = (city: string) => {
    fetchByCity(city);
  };

  const handleCurrentLocation = () => {
    fetchCurrentLocation();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      
      {/* Background ambient animation */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
      </div>
      
      {/* Header */}
      <header className="relative z-10 border-b glass-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-foreground mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {location} Air Clarity
              </h1>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <span>Government Crisis Management System</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-2 glass-card px-4 py-3 rounded-lg border-2 border-primary/20 bg-primary/5">
                <Clock className="w-5 h-5 text-primary animate-pulse-soft" />
                <div className="text-center">
                  <div className="text-xs text-muted-foreground font-medium">Last Updated</div>
                  <div className="text-sm font-semibold text-primary">
                    {lastFetch ? lastFetch.toLocaleTimeString() : 'Loading...'}
                  </div>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-2 glass-card px-3 py-2 rounded-lg transition-all",
                connectionStatus === "connected" && "border-green-500/20",
                connectionStatus === "reconnecting" && "border-yellow-500/20",
                connectionStatus === "offline" && "border-red-500/20"
              )}>
                {getConnectionIcon()}
                <span>{getConnectionText()}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="relative z-10 container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Location Search */}
        <div className="mb-6 sm:mb-8 animate-fade-in-up">
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            onCurrentLocation={handleCurrentLocation}
            currentLocation={location}
            loading={isLoading}
          />
        </div>
        {error && (
          <div className="mb-6 sm:mb-8 animate-fade-in-up">
            <Card className="border-l-4 border-l-destructive bg-destructive/5 min-w-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-destructive truncate">Error Loading Data</h3>
                    <p className="text-sm text-muted-foreground truncate">{error}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refresh}
                    className="ml-auto"
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-w-0">
            <div className="lg:col-span-1 min-w-0">
              <LoadingSkeleton variant="metric" />
            </div>
            <div className="lg:col-span-2 min-w-0">
              <LoadingSkeleton className="h-64" />
            </div>
            <div className="lg:col-span-3 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4 min-w-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <LoadingSkeleton key={i} variant="metric" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-3 min-w-0">
              <LoadingSkeleton className="h-96" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 min-w-0">
            {/* Main AQI Display */}
            <div className="lg:col-span-1 animate-fade-in-up min-w-0">
              {aqiData && (
                <AQICard 
                  aqi={aqiData.aqi} 
                  location={location}
                  trend="stable"
                  onLearnMore={handleLearnMore}
                  className="min-w-0"
                />
              )}
            </div>

            {/* Recommendations */}
            <div className="lg:col-span-2 animate-fade-in-up min-w-0" style={{ animationDelay: "0.1s" }}>
              {aqiData && (
                <RecommendationsCard 
                  aqi={aqiData.aqi} 
                  onLearnMore={handleRecommendationLearnMore} 
                />
              )}
            </div>

            {/* Key Pollutants */}
            <div className="lg:col-span-3 animate-fade-in-up min-w-0" style={{ animationDelay: "0.2s" }}>
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent truncate">
                  Key Pollutants Monitoring
                </h2>
                <p className="text-muted-foreground truncate">Real-time readings from OpenWeatherMap across {location}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4 min-w-0">
                {aqiData && [
                  { name: "PM2.5", value: aqiData.pollutants.pm2_5, unit: "μg/m³", trend: "stable" as "stable", trendValue: 0, status: getPollutantStatus("PM2.5", aqiData.pollutants.pm2_5) },
                  { name: "PM10", value: aqiData.pollutants.pm10, unit: "μg/m³", trend: "stable" as "stable", trendValue: 0, status: getPollutantStatus("PM10", aqiData.pollutants.pm10) },
                  { name: "NO2", value: aqiData.pollutants.no2, unit: "ppb", trend: "stable" as "stable", trendValue: 0, status: getPollutantStatus("NO2", aqiData.pollutants.no2) },
                  { name: "CO", value: aqiData.pollutants.co, unit: "ppm", trend: "stable" as "stable", trendValue: 0, status: getPollutantStatus("CO", aqiData.pollutants.co) },
                  { name: "O3", value: aqiData.pollutants.o3, unit: "ppb", trend: "stable" as "stable", trendValue: 0, status: getPollutantStatus("O3", aqiData.pollutants.o3) },
                  { name: "SO2", value: aqiData.pollutants.so2, unit: "ppb", trend: "stable" as "stable", trendValue: 0, status: getPollutantStatus("SO2", aqiData.pollutants.so2) }
                ].map((pollutant, index) => (
                  <div 
                    key={pollutant.name}
                    className="animate-fade-in-up hover-lift min-w-0"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <PollutantCard {...pollutant} onLearnMore={handlePollutantLearnMore} />
                  </div>
                ))}
              </div>
            </div>

            {/* AQI Map */}
            <div className="lg:col-span-3 animate-fade-in-up min-w-0" style={{ animationDelay: "0.8s" }}>
              <DelhiAQIMap location={location} aqiData={aqiData} />
            </div>
          </div>
        )}
      </main>

      {/* Protection Modal */}
      <ProtectionModal
        open={protectionModalOpen}
        aqiLevel={selectedAQILevel}
        aqiValue={selectedAQIValue}
        pollutant={selectedPollutant}
        recommendation={selectedRecommendation}
        onClose={() => {
          setProtectionModalOpen(false);
          setSelectedAQILevel(null);
          setSelectedAQIValue(undefined);
          setSelectedPollutant(null);
          setSelectedRecommendation(null);
        }}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t glass-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground animate-fade-in">
            <p className="font-medium">Delhi Pollution Control Committee • Government Crisis Management System</p>
            <p className="mt-2 opacity-80">Data updated every 15 minutes • Emergency Hotline: 1800-XXX-XXXX</p>
            <div className="mt-4 flex justify-center items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
              <span>System Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
