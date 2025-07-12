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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, Cloud, BarChart3, Heart, Map, Leaf, AlertTriangle, RefreshCw } from "lucide-react";

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
            <TabsTrigger value="remedies" className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Remedies
            </TabsTrigger>
          </TabsList>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <PollutantCard 
                    name="PM2.5" 
                    value={data.pollutants.pm2_5} 
                    unit="μg/m³" 
                    trend={getPollutantTrend(data.pollutants.pm2_5)}
                    trendValue={getTrendValue(data.pollutants.pm2_5)}
                    status={getPollutantStatus("PM2.5", data.pollutants.pm2_5)}
                    onLearnMore={(pollutant) => {
                      setModalData({ type: 'pollutant', data: pollutant });
                      setShowProtectionModal(true);
                    }}
                  />
                  <PollutantCard 
                    name="PM10" 
                    value={data.pollutants.pm10} 
                    unit="μg/m³" 
                    trend={getPollutantTrend(data.pollutants.pm10)}
                    trendValue={getTrendValue(data.pollutants.pm10)}
                    status={getPollutantStatus("PM10", data.pollutants.pm10)}
                    onLearnMore={(pollutant) => {
                      setModalData({ type: 'pollutant', data: pollutant });
                      setShowProtectionModal(true);
                    }}
                  />
                  <PollutantCard 
                    name="NO2" 
                    value={data.pollutants.no2} 
                    unit="ppb" 
                    trend={getPollutantTrend(data.pollutants.no2)}
                    trendValue={getTrendValue(data.pollutants.no2)}
                    status={getPollutantStatus("NO2", data.pollutants.no2)}
                    onLearnMore={(pollutant) => {
                      setModalData({ type: 'pollutant', data: pollutant });
                      setShowProtectionModal(true);
                    }}
                  />
                  <PollutantCard 
                    name="CO" 
                    value={data.pollutants.co} 
                    unit="ppm" 
                    trend={getPollutantTrend(data.pollutants.co)}
                    trendValue={getTrendValue(data.pollutants.co)}
                    status={getPollutantStatus("CO", data.pollutants.co)}
                    onLearnMore={(pollutant) => {
                      setModalData({ type: 'pollutant', data: pollutant });
                      setShowProtectionModal(true);
                    }}
                  />
                  <PollutantCard 
                    name="O3" 
                    value={data.pollutants.o3} 
                    unit="ppb" 
                    trend={getPollutantTrend(data.pollutants.o3)}
                    trendValue={getTrendValue(data.pollutants.o3)}
                    status={getPollutantStatus("O3", data.pollutants.o3)}
                    onLearnMore={(pollutant) => {
                      setModalData({ type: 'pollutant', data: pollutant });
                      setShowProtectionModal(true);
                    }}
                  />
                  <PollutantCard 
                    name="SO2" 
                    value={data.pollutants.so2} 
                    unit="ppb" 
                    trend={getPollutantTrend(data.pollutants.so2)}
                    trendValue={getTrendValue(data.pollutants.so2)}
                    status={getPollutantStatus("SO2", data.pollutants.so2)}
                    onLearnMore={(pollutant) => {
                      setModalData({ type: 'pollutant', data: pollutant });
                      setShowProtectionModal(true);
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Recommendations Card - Full Width */}
            <RecommendationsCard 
              aqi={data.aqi} 
              onLearnMore={(recommendation) => {
                setModalData({ type: 'recommendation', data: recommendation });
                setShowProtectionModal(true);
              }}
            />
            
            {/* Four Cards Below - 2 on each side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side - 2 Cards */}
              <div className="space-y-4">
                {/* Emergency Protocols Card */}
                <div className="rounded-lg p-6 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Emergency Protocols
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Immediate actions to take during hazardous air quality conditions.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Stay indoors with windows closed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">Use air purifiers if available</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700">Wear N95 masks if going outside</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setActiveTab('health')}
                    className="w-full mt-4 font-medium bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    View Emergency Guide
                  </Button>
                </div>
                
                {/* Health Monitoring Card */}
                <div className="rounded-lg p-6 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <Heart className="w-5 h-5 text-blue-500" />
                    Health Monitoring
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Track your health symptoms and get personalized guidance.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Monitor breathing difficulties</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Check for eye irritation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Track cough and throat issues</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setActiveTab('health')}
                    className="w-full mt-4 font-medium bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Health Check
                  </Button>
                </div>
              </div>
              
              {/* Right Side - 2 Cards */}
              <div className="space-y-4">
                {/* Natural Remedies Card */}
                <div className="rounded-lg p-6 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <Leaf className="w-5 h-5 text-green-500" />
                    Natural Remedies
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Traditional Indian remedies for air pollution protection.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Tulsi tea for respiratory health</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700">Ginger and honey remedies</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">Steam inhalation with eucalyptus</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setActiveTab('remedies')}
                    className="w-full mt-4 font-medium bg-green-500 hover:bg-green-600 text-white"
                  >
                    View Remedies
                  </Button>
                </div>
                
                {/* Air Quality Solutions Card */}
                <div className="rounded-lg p-6 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                    <Shield className="w-5 h-5 text-purple-500" />
                    Air Quality Solutions
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Practical solutions to improve indoor and outdoor air quality.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Indoor air purifiers and plants</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-gray-700">Ventilation strategies</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span className="text-gray-700">Community action plans</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setActiveTab('solutions')}
                    className="w-full mt-4 font-medium bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    View Solutions
                  </Button>
                </div>
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
  );
}
