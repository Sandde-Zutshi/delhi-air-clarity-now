import React, { useState } from 'react';
import { useAQI } from '@/hooks/useAQI';
import { AQICard } from '@/components/AQICard';
import { PollutantCard } from '@/components/PollutantCard';
import { RecommendationsCard } from '@/components/RecommendationsCard';
import { ProtectionModal } from '@/components/ProtectionModal';
import { DelhiAQIMap } from '@/components/DelhiAQIMap';
import { HealthGuidanceCard } from '@/components/HealthGuidanceCard';
import { ForecastCard } from '@/components/ForecastCard';
import { HistoricalDataCard } from '@/components/HistoricalDataCard';
import { SolutionsCard } from '@/components/SolutionsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, Cloud, BarChart3, Heart, Map, Settings, AlertTriangle } from "lucide-react";

export default function Index() {
  const { data, loading, error } = useAQI({ initialLocation: 'Delhi' });
  const [showProtectionModal, setShowProtectionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading Delhi Air Quality Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-800 mb-2">Error Loading Data</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h1>
          <p className="text-gray-600">Unable to fetch air quality data for Delhi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Delhi Air Quality Dashboard</h1>
              <p className="text-sm text-gray-600">
                Real-time air quality monitoring for Delhi, India
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">{currentDate}</div>
              <div className="text-lg font-semibold text-gray-900">{currentTime}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Health
            </TabsTrigger>
            <TabsTrigger value="forecast" className="flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Forecast
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Map
            </TabsTrigger>
            <TabsTrigger value="solutions" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Solutions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <AQICard aqi={data.aqi} />
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <PollutantCard 
                    name="PM2.5" 
                    value={data.pollutants.pm2_5} 
                    unit="μg/m³" 
                    trend="stable" 
                    trendValue={0} 
                    status="moderate" 
                  />
                  <PollutantCard 
                    name="PM10" 
                    value={data.pollutants.pm10} 
                    unit="μg/m³" 
                    trend="stable" 
                    trendValue={0} 
                    status="moderate" 
                  />
                  <PollutantCard 
                    name="NO2" 
                    value={data.pollutants.no2} 
                    unit="ppb" 
                    trend="stable" 
                    trendValue={0} 
                    status="moderate" 
                  />
                  <PollutantCard 
                    name="CO" 
                    value={data.pollutants.co} 
                    unit="ppm" 
                    trend="stable" 
                    trendValue={0} 
                    status="moderate" 
                  />
                  <PollutantCard 
                    name="O3" 
                    value={data.pollutants.o3} 
                    unit="ppb" 
                    trend="stable" 
                    trendValue={0} 
                    status="moderate" 
                  />
                  <PollutantCard 
                    name="SO2" 
                    value={data.pollutants.so2} 
                    unit="ppb" 
                    trend="stable" 
                    trendValue={0} 
                    status="moderate" 
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecommendationsCard aqi={data.aqi} />
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Quick Health Alert
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Current air quality conditions require attention. Check the Health tab for detailed guidance.
                </p>
                <Button 
                  onClick={() => setActiveTab('health')}
                  className="w-full"
                >
                  View Health Guidance
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <HealthGuidanceCard 
              aqi={data.aqi} 
              location="Delhi"
            />
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <ForecastCard />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <HistoricalDataCard />
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Delhi Air Quality Map</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time air quality monitoring across Delhi with station-level data
                </p>
              </div>
              <DelhiAQIMap />
            </div>
          </TabsContent>

          {/* Solutions Tab */}
          <TabsContent value="solutions" className="space-y-6">
            <SolutionsCard />
          </TabsContent>
        </Tabs>
      </main>

              {/* Protection Modal */}
        <ProtectionModal 
          open={showProtectionModal} 
          onClose={() => setShowProtectionModal(false)} 
          aqiLevel={null}
          aqiValue={data.aqi}
        />

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Delhi Air Quality Dashboard - Government Grade Monitoring System</p>
            <p className="mt-1">Data sourced from official monitoring stations • Last updated: {currentTime}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
