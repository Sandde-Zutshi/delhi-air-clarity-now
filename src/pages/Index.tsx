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

  // Helper functions for dynamic alert styling
  const getAlertGradient = (aqi: number) => {
    if (aqi <= 50) return 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
    if (aqi <= 100) return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
    if (aqi <= 150) return 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)';
    if (aqi <= 200) return 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
    if (aqi <= 300) return 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)';
    return 'linear-gradient(135deg, #7F1D1D 0%, #450A0A 100%)';
  };

  const getAlertBorderColor = (aqi: number) => {
    if (aqi <= 50) return '#10B981';
    if (aqi <= 100) return '#F59E0B';
    if (aqi <= 150) return '#F97316';
    if (aqi <= 200) return '#EF4444';
    if (aqi <= 300) return '#8B5CF6';
    return '#7F1D1D';
  };

  const getAlertIconColor = (aqi: number) => {
    if (aqi <= 50) return '#FFFFFF';
    if (aqi <= 100) return '#FFFFFF';
    if (aqi <= 150) return '#FFFFFF';
    if (aqi <= 200) return '#FFFFFF';
    if (aqi <= 300) return '#FFFFFF';
    return '#FFFFFF';
  };

  const getAlertTextColor = (aqi: number) => {
    if (aqi <= 50) return '#FFFFFF';
    if (aqi <= 100) return '#FFFFFF';
    if (aqi <= 150) return '#FFFFFF';
    if (aqi <= 200) return '#FFFFFF';
    if (aqi <= 300) return '#FFFFFF';
    return '#FFFFFF';
  };

  const getAlertTitle = (aqi: number) => {
    if (aqi <= 50) return 'Good Air Quality';
    if (aqi <= 100) return 'Moderate Air Quality';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy Air Quality';
    if (aqi <= 300) return 'Very Unhealthy Air Quality';
    return 'Hazardous Air Quality';
  };

  const getAlertMessage = (aqi: number) => {
    if (aqi <= 50) return 'Air quality is good. Enjoy outdoor activities safely.';
    if (aqi <= 100) return 'Air quality is acceptable. Sensitive groups should limit outdoor activities.';
    if (aqi <= 150) return 'Sensitive groups should avoid outdoor activities. Others should limit prolonged exertion.';
    if (aqi <= 200) return 'Everyone should avoid outdoor activities. Stay indoors with windows closed.';
    if (aqi <= 300) return 'Health emergency. Avoid all outdoor activities. Use air purifiers indoors.';
    return 'Health emergency. Remain indoors. Use air purifiers and masks if going outside is necessary.';
  };

  const getAlertButtonBg = (aqi: number) => {
    if (aqi <= 50) return '#FFFFFF';
    if (aqi <= 100) return '#FFFFFF';
    if (aqi <= 150) return '#FFFFFF';
    if (aqi <= 200) return '#FFFFFF';
    if (aqi <= 300) return '#FFFFFF';
    return '#FFFFFF';
  };

  const getAlertButtonText = (aqi: number) => {
    if (aqi <= 50) return '#10B981';
    if (aqi <= 100) return '#F59E0B';
    if (aqi <= 150) return '#F97316';
    if (aqi <= 200) return '#EF4444';
    if (aqi <= 300) return '#8B5CF6';
    return '#7F1D1D';
  };

  const getAlertButtonBorder = (aqi: number) => {
    if (aqi <= 50) return '#10B981';
    if (aqi <= 100) return '#F59E0B';
    if (aqi <= 150) return '#F97316';
    if (aqi <= 200) return '#EF4444';
    if (aqi <= 300) return '#8B5CF6';
    return '#7F1D1D';
  };

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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecommendationsCard 
                aqi={data.aqi} 
                onLearnMore={(recommendation) => {
                  setModalData({ type: 'recommendation', data: recommendation });
                  setShowProtectionModal(true);
                }}
              />
              <div 
                className="rounded-lg p-6 shadow-sm border-2 transition-all duration-300"
                style={{
                  background: getAlertGradient(data.aqi),
                  borderColor: getAlertBorderColor(data.aqi)
                }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: getAlertIconColor(data.aqi) }} />
                  <span style={{ color: getAlertTextColor(data.aqi) }}>
                    {getAlertTitle(data.aqi)}
                  </span>
                </h3>
                <p className="text-sm mb-4" style={{ color: getAlertTextColor(data.aqi) }}>
                  {getAlertMessage(data.aqi)}
                </p>
                
                {/* Emergency Numbers */}
                <div className="mb-4 p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                  <h4 className="font-medium mb-2 text-sm" style={{ color: getAlertTextColor(data.aqi) }}>
                    🚨 Emergency Contacts
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">SOS:</span>
                      <span>112</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Police:</span>
                      <span>100</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Ambulance:</span>
                      <span>102</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Fire:</span>
                      <span>101</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setActiveTab('health')}
                  className="w-full font-medium"
                  style={{
                    backgroundColor: getAlertButtonBg(data.aqi),
                    color: getAlertButtonText(data.aqi),
                    borderColor: getAlertButtonBorder(data.aqi)
                  }}
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
