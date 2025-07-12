import React, { useState } from 'react';
import { useDelhiStations } from '@/hooks/useDelhiStations';
import { StationList, StationDataCard } from '@/components/StationDataCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Activity, Database, RefreshCw, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { StationData } from '@/lib/delhi-station-api';

export default function Stations() {
  const {
    stationsData,
    loading,
    error,
    selectedStation,
    worstAffectedStations,
    stationsByLevel,
    refreshData,
    selectStation,
    averageAQI,
    totalStations,
    lastUpdated
  } = useDelhiStations();

  const [activeTab, setActiveTab] = useState("overview");

  const handleStationSelect = (station: StationData) => {
    selectStation(station.name);
  };

  const getAQILevelColor = (level: string) => {
    switch (level) {
      case "Good": return "text-green-600 bg-green-100";
      case "Moderate": return "text-yellow-600 bg-yellow-100";
      case "Unhealthy for Sensitive Groups": return "text-orange-600 bg-orange-100";
      case "Unhealthy": return "text-red-600 bg-red-100";
      case "Very Unhealthy": return "text-purple-600 bg-purple-100";
      case "Hazardous": return "text-red-800 bg-red-200";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getAQILevelIcon = (level: string) => {
    if (level === "Hazardous" || level === "Very Unhealthy") return <AlertTriangle className="w-4 h-4" />;
    if (level === "Unhealthy" || level === "Unhealthy for Sensitive Groups") return <AlertCircle className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  if (loading && !stationsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Loading Delhi Station Data</h2>
            <p className="text-muted-foreground">Fetching real-time data from WAQI and OpenAQ APIs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Station Data</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshData} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Delhi Air Quality Monitoring Stations
            </h1>
            <p className="text-muted-foreground">
              Real-time data from government monitoring stations across Delhi
            </p>
          </div>
          <Button 
            onClick={refreshData} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average AQI</p>
                  <p className="text-2xl font-bold">{averageAQI}</p>
                </div>
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Stations</p>
                  <p className="text-2xl font-bold">{totalStations}</p>
                </div>
                <Database className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Worst Station</p>
                  <p className="text-lg font-semibold">
                    {worstAffectedStations[0]?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    AQI: {worstAffectedStations[0]?.aqi || 0}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium">
                    {lastUpdated ? lastUpdated.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    }) : 'N/A'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="worst">Worst Affected</TabsTrigger>
          <TabsTrigger value="by-level">By AQI Level</TabsTrigger>
          <TabsTrigger value="details">Station Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                All Delhi Monitoring Stations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stationsData && (
                <StationList
                  stations={stationsData.stations}
                  selectedStation={selectedStation}
                  onStationSelect={handleStationSelect}
                  title=""
                  showDetails={false}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="worst" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Worst Affected Areas
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Top 5 stations with highest AQI levels
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {worstAffectedStations.map((station, index) => (
                  <div key={station.id} className="relative">
                    <StationDataCard
                      station={station}
                      showDetails={true}
                    />
                    <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-level" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(stationsByLevel).map(([level, stations]) => (
              <Card key={level}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getAQILevelIcon(level)}
                    <span className={getAQILevelColor(level)}>
                      {level}
                    </span>
                    <Badge variant="outline">{stations.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stations.map((station) => (
                      <div
                        key={station.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleStationSelect(station)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{station.name}</p>
                            <p className="text-sm text-muted-foreground">{station.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">{station.aqi}</p>
                            <p className="text-xs text-muted-foreground">AQI</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {selectedStation ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Selected Station Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <StationDataCard
                    station={selectedStation}
                    showDetails={true}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Station Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedStation.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Coordinates: {selectedStation.coordinates.lat.toFixed(4)}, {selectedStation.coordinates.lon.toFixed(4)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Data Source</h4>
                    <div className="flex items-center gap-2">
                      {selectedStation.source === 'WAQI' ? (
                        <Database className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Activity className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-sm">{selectedStation.source}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Station Type</h4>
                    <Badge variant="outline">{selectedStation.stationType}</Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Last Updated</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedStation.lastUpdated.toLocaleString('en-IN')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Select a station from the overview to view detailed information
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 