import { AQICard } from "@/components/AQICard";
import { PollutantCard } from "@/components/PollutantCard";
import { RecommendationsCard } from "@/components/RecommendationsCard";
import { HotspotMap } from "@/components/HotspotMap";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Clock, Wifi, Zap, AlertTriangle, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Simulated real-time data - in production, this would come from APIs
const currentAQI = 287;
const previousAQI = 275;
const lastUpdated = new Date();

const pollutantsData = [
  { name: "PM2.5", value: 158, unit: "μg/m³", trend: "up" as const, trendValue: 12, status: "critical" as const },
  { name: "PM10", value: 203, unit: "μg/m³", trend: "up" as const, trendValue: 8, status: "critical" as const },
  { name: "NO2", value: 67, unit: "ppb", trend: "stable" as const, trendValue: 0, status: "unhealthy" as const },
  { name: "CO", value: 2.1, unit: "ppm", trend: "down" as const, trendValue: 5, status: "moderate" as const },
  { name: "O3", value: 89, unit: "ppb", trend: "up" as const, trendValue: 15, status: "unhealthy" as const },
  { name: "SO2", value: 12, unit: "ppb", trend: "stable" as const, trendValue: 0, status: "good" as const }
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "reconnecting" | "offline">("connected");
  
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    
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
      clearTimeout(timer);
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
                Delhi Air Clarity
              </h1>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <span>Government Crisis Management System</span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>{lastUpdated.toLocaleString()}</span>
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <LoadingSkeleton variant="metric" />
            </div>
            <div className="lg:col-span-2">
              <LoadingSkeleton className="h-64" />
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <LoadingSkeleton key={i} variant="metric" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-3">
              <LoadingSkeleton className="h-96" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main AQI Display */}
            <div className="lg:col-span-1 animate-fade-in-up">
              <AQICard 
                aqi={currentAQI} 
                trend="up" 
                previousAqi={previousAQI}
              />
            </div>

            {/* Recommendations */}
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <RecommendationsCard aqi={currentAQI} />
            </div>

            {/* Key Pollutants */}
            <div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Key Pollutants Monitoring
                </h2>
                <p className="text-muted-foreground">Real-time readings from monitoring stations across Delhi</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {pollutantsData.map((pollutant, index) => (
                  <div 
                    key={pollutant.name}
                    className="animate-fade-in-up hover-lift"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <PollutantCard {...pollutant} />
                  </div>
                ))}
              </div>
            </div>

            {/* Hotspot Map */}
            <div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
              <HotspotMap />
            </div>
          </div>
        )}
      </main>

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
