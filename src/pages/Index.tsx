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
import { RemediesCard } from '@/components/RemediesCard';
import { EmergencyAlertBanner } from '@/components/EmergencyAlertBanner';
import { getPollutantStatus, getPollutantTrend, getTrendValue } from '@/lib/pollutant-utils';
import { AQICardHoverProvider } from '@/components/AQICardHoverContext';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, Cloud, BarChart3, Heart, Map, Leaf, AlertTriangle, RefreshCw, LayoutGrid, Rows2 } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

export default function Index() {
  const { 
    data, 
    loading, 
    error, 
    refresh,
    canManualRefresh,
    remainingManualRefreshes
  } = useAQI({ initialLocation: 'Delhi' });
  const [showProtectionModal, setShowProtectionModal] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(true);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  const handleRefresh = async () => {
    if (!canManualRefresh) {
      alert('Manual refresh limit reached for today. Please try again tomorrow.');
      return;
    }
    
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

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
    <AQICardHoverProvider>
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
              
              {/* Emergency Alert Banner - In Header */}
              {data && showEmergencyBanner && (
                <div className="flex-1 mx-8">
                  <EmergencyAlertBanner
                    aqi={data.aqi}
                    onDismiss={() => setShowEmergencyBanner(false)}
                    onViewHealth={() => setActiveTab('health')}
                  />
                </div>
              )}
              
              <div className="text-right">
                <div className="text-sm text-gray-600">{currentDate}</div>
                <div className="text-lg font-semibold text-gray-900">{currentTime}</div>
                <Button
                  onClick={handleRefresh}
                  disabled={loading || isRefreshing || !canManualRefresh}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  title={!canManualRefresh ? `Manual refresh limit reached. ${remainingManualRefreshes} remaining.` : 'Refresh data'}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <TabsList className="grid w-full grid-cols-7">
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
                <TabsTrigger value="remedies" className="flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  Remedies
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Recommendations
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-2 ml-4">
                {viewMode === 'carousel' ? (
                  <Button variant="ghost" size="icon" aria-label="View All" onClick={() => setViewMode('grid')}>
                    <LayoutGrid className="w-5 h-5" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" aria-label="Collapse" onClick={() => setViewMode('carousel')}>
                    <Rows2 className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <AQICard 
                    aqi={data.aqi} 
                    source={data.source}
                    aqiLevel={data.aqiLevel}
                    healthImplications={data.healthImplications}
                    onLearnMore={(level) => {
                      setModalData({ type: 'aqi', data: level });
                      setShowProtectionModal(true);
                    }}
                  />
                </div>
                <div className="lg:col-span-2">
                  {viewMode === 'carousel' ? (
                    <Carousel opts={{ align: 'start' }}>
                      <CarouselContent>
                        {["PM2.5", "PM10", "NO2", "CO", "O3", "SO2"].map((pollutant, idx, arr) => (
                          <CarouselItem key={pollutant} className="basis-1/2 max-w-[50%]">
                            <div className="px-2">
                              <PollutantCard
                                name={pollutant}
                                value={data.pollutants[pollutant.toLowerCase().replace('.', '_')]}
                                unit={pollutant === 'CO' ? 'ppm' : pollutant === 'PM2.5' || pollutant === 'PM10' ? 'μg/m³' : 'ppb'}
                                trend={getPollutantTrend(data.pollutants[pollutant.toLowerCase().replace('.', '_')])}
                                trendValue={getTrendValue(data.pollutants[pollutant.toLowerCase().replace('.', '_')])}
                                status={getPollutantStatus(pollutant, data.pollutants[pollutant.toLowerCase().replace('.', '_')])}
                                onLearnMore={(pollutantData) => {
                                  setModalData({ type: 'pollutant', data: pollutantData });
                                  setShowProtectionModal(true);
                                }}
                                showTrendLine={true}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="flex justify-between mt-2">
                        <CarouselPrevious />
                        <CarouselNext />
                      </div>
                    </Carousel>
                  ) : (
                    <div className="grid grid-cols-3 grid-rows-2 gap-4">
                      {["PM2.5", "PM10", "NO2", "CO", "O3", "SO2"].map((pollutant) => (
                        <PollutantCard
                          key={pollutant}
                          name={pollutant}
                          value={data.pollutants[pollutant.toLowerCase().replace('.', '_')]}
                          unit={pollutant === 'CO' ? 'ppm' : pollutant === 'PM2.5' || pollutant === 'PM10' ? 'μg/m³' : 'ppb'}
                          trend={getPollutantTrend(data.pollutants[pollutant.toLowerCase().replace('.', '_')])}
                          trendValue={getTrendValue(data.pollutants[pollutant.toLowerCase().replace('.', '_')])}
                          status={getPollutantStatus(pollutant, data.pollutants[pollutant.toLowerCase().replace('.', '_')])}
                          onLearnMore={(pollutantData) => {
                            setModalData({ type: 'pollutant', data: pollutantData });
                            setShowProtectionModal(true);
                          }}
                          showTrendLine={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              <RecommendationsCard 
                aqi={data.aqi} 
                onLearnMore={(recommendation) => {
                  setModalData({ type: 'recommendation', data: recommendation });
                  setShowProtectionModal(true);
                }}
              />
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

            {/* Remedies Tab */}
            <TabsContent value="remedies" className="space-y-6">
              <RemediesCard />
            </TabsContent>
          </Tabs>
        </main>

        {/* Protection Modal */}
        <ProtectionModal 
          open={showProtectionModal} 
          onClose={() => {
            setShowProtectionModal(false);
            setModalData(null);
          }} 
          aqiLevel={modalData?.type === 'aqi' ? modalData.data : null}
          aqiValue={data.aqi}
          pollutant={modalData?.type === 'pollutant' ? modalData.data : undefined}
          recommendation={modalData?.type === 'recommendation' ? modalData.data : undefined}
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
    </AQICardHoverProvider>
  );
}
