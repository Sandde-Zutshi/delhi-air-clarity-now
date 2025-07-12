import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus, Calendar, BarChart3, MapPin, Users, Download, Clock, AlertTriangle, Info } from "lucide-react";
import { 
  DELHI_HISTORICAL_DATA,
  DELHI_SEASONAL_PATTERNS,
  INDIAN_CITIES_COMPARISON,
  getCurrentSeasonalPattern,
  analyze24HourTrend,
  getTopPollutedCities,
  generateHistoricalInsights,
  exportHistoricalData,
  SeasonalPattern,
  CityComparison 
} from '@/lib/historical-data';
import { cn } from "@/lib/utils";

export function HistoricalDataCard() {
  const [activeTab, setActiveTab] = useState('trends');
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d' | 'seasonal'>('24h');
  
  const currentSeason = getCurrentSeasonalPattern();
  const trend24h = analyze24HourTrend(DELHI_HISTORICAL_DATA);
  const topCities = getTopPollutedCities(5);
  const insights = generateHistoricalInsights(DELHI_HISTORICAL_DATA);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'worsening': return <TrendingUp className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-100';
      case 'worsening': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#00E400";
    if (aqi <= 100) return "#FFFF00";
    if (aqi <= 150) return "#FF7E00";
    if (aqi <= 200) return "#FF0000";
    if (aqi <= 300) return "#8F3F97";
    return "#7E0023";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleExportData = (format: 'csv' | 'json') => {
    const data = exportHistoricalData(DELHI_HISTORICAL_DATA, format);
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delhi-aqi-data.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Historical Data & Trend Analysis
          </CardTitle>
          <Badge className={cn("text-sm font-medium", getTrendColor(trend24h.trend))}>
            {getTrendIcon(trend24h.trend)}
            <span className="ml-1">{trend24h.trend.toUpperCase()}</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Historical trends, seasonal patterns, and city comparisons for Delhi
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            {/* 24-Hour Trend Analysis */}
            <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  24-Hour Trend Analysis
                </h3>
                <Badge className={cn("text-sm", getTrendColor(trend24h.trend))}>
                  {trend24h.trend.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Average AQI:</span> {trend24h.averageAQI}
                  <br />
                  <span className="font-medium">Change:</span> {trend24h.changePercentage > 0 ? '+' : ''}{trend24h.changePercentage}%
                </div>
                <div>
                  <span className="font-medium">Best Time:</span> {trend24h.bestTime}
                  <br />
                  <span className="font-medium">Worst Time:</span> {trend24h.worstTime}
                </div>
                <div>
                  <span className="font-medium">Recommendations:</span>
                  <ul className="mt-1 space-y-1">
                    {trend24h.recommendations.slice(0, 2).map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Historical Data Points */}
            <div className="space-y-3">
              <h3 className="font-semibold">Historical Data Points</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {DELHI_HISTORICAL_DATA.slice(-6).map((data, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">
                        {formatDate(data.date)}
                      </div>
                      <Badge 
                        style={{ backgroundColor: getAQIColor(data.aqi), color: 'white' }}
                        className="text-xs"
                      >
                        {data.aqi}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>PM2.5: {data.pm2_5} µg/m³</div>
                      <div>PM10: {data.pm10} µg/m³</div>
                      <div>NO2: {data.no2} µg/m³</div>
                      {data.temperature && <div>Temp: {data.temperature}°C</div>}
                      {data.humidity && <div>Humidity: {data.humidity}%</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Data */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Historical Data
              </h4>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportData('csv')}
                >
                  Export as CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportData('json')}
                >
                  Export as JSON
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-4">
            {/* Current Season */}
            <div className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Current Season: {currentSeason.season.charAt(0).toUpperCase() + currentSeason.season.slice(1)}
                </h3>
                <Badge 
                  style={{ backgroundColor: getAQIColor(currentSeason.averageAQI), color: 'white' }}
                >
                  Avg AQI: {currentSeason.averageAQI}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Peak Hours:</span>
                  <ul className="mt-1 space-y-1">
                    {currentSeason.peakHours.map((hour, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        {hour}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium">Health Risks:</span>
                  <ul className="mt-1 space-y-1">
                    {currentSeason.healthRisks.slice(0, 3).map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* All Seasons */}
            <div className="space-y-3">
              <h3 className="font-semibold">Seasonal Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DELHI_SEASONAL_PATTERNS.map((season, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium capitalize">{season.season}</h4>
                      <Badge 
                        style={{ backgroundColor: getAQIColor(season.averageAQI), color: 'white' }}
                        className="text-xs"
                      >
                        {season.averageAQI}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium">Common Sources:</span>
                        <ul className="mt-1 space-y-1">
                          {season.commonSources.slice(0, 3).map((source, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              {source}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <span className="font-medium">Recommendations:</span>
                        <ul className="mt-1 space-y-1">
                          {season.recommendations.slice(0, 2).map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cities" className="space-y-4">
            {/* City Rankings */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Indian Cities Air Quality Ranking
              </h3>
              <div className="space-y-3">
                {topCities.map((city, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {city.rank}
                      </div>
                      <div>
                        <div className="font-medium">{city.city}</div>
                        <div className="text-sm text-muted-foreground">
                          Population: {city.population.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        style={{ backgroundColor: getAQIColor(city.currentAQI), color: 'white' }}
                        className="mb-1"
                      >
                        {city.currentAQI}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs">
                        {getTrendIcon(city.trend)}
                        <span className={cn(
                          city.trend === 'improving' ? 'text-green-600' :
                          city.trend === 'worsening' ? 'text-red-600' : 'text-gray-600'
                        )}>
                          {city.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delhi vs Other Cities */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Delhi vs Major Cities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Delhi's Position:</span>
                  <br />
                  <span className="text-2xl font-bold text-red-600">#{topCities[0].rank}</span> in India
                  <br />
                  <span className="text-muted-foreground">
                    AQI: {topCities[0].currentAQI} ({topCities[0].trend})
                  </span>
                </div>
                <div>
                  <span className="font-medium">Major Sources:</span>
                  <ul className="mt-1 space-y-1">
                    {topCities[0].majorSources.map((source, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            {/* Key Insights */}
            <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Key Historical Insights
              </h3>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seasonal Comparison */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Seasonal AQI Comparison</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DELHI_SEASONAL_PATTERNS.map((season, index) => (
                  <div key={index} className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-bold capitalize">{season.season}</div>
                    <Badge 
                      style={{ backgroundColor: getAQIColor(season.averageAQI), color: 'white' }}
                      className="mt-2"
                    >
                      {season.averageAQI}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Quality */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                Data Quality Information
              </h4>
              <div className="text-sm space-y-2">
                <p>• Historical data is based on CPCB monitoring stations</p>
                <p>• Seasonal patterns are derived from multi-year analysis</p>
                <p>• City comparisons use standardized AQI calculations</p>
                <p>• Data is updated every hour from official sources</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 