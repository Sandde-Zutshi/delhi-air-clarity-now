import { AQICard } from "@/components/AQICard";
import { PollutantCard } from "@/components/PollutantCard";
import { RecommendationsCard } from "@/components/RecommendationsCard";
import { HotspotMap } from "@/components/HotspotMap";
import { Clock, Wifi } from "lucide-react";

// Simulated real-time data - in production, this would come from APIs
const currentAQI = 287;
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
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Delhi Air Quality Dashboard</h1>
              <p className="text-muted-foreground text-sm">Government Crisis Management System</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{lastUpdated.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-500" />
                <span>Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main AQI Display */}
          <div className="lg:col-span-1">
            <AQICard aqi={currentAQI} />
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-2">
            <RecommendationsCard aqi={currentAQI} />
          </div>

          {/* Key Pollutants */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Key Pollutants Monitoring</h2>
              <p className="text-muted-foreground text-sm">Real-time readings from monitoring stations across Delhi</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {pollutantsData.map((pollutant) => (
                <PollutantCard key={pollutant.name} {...pollutant} />
              ))}
            </div>
          </div>

          {/* Hotspot Map */}
          <div className="lg:col-span-3">
            <HotspotMap />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Delhi Pollution Control Committee • Government Crisis Management System</p>
            <p className="mt-1">Data updated every 15 minutes • Emergency Hotline: 1800-XXX-XXXX</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
