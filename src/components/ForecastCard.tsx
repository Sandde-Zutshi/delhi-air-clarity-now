import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Clock, Cloud, Wind, Thermometer, Eye, AlertCircle, Phone, Download } from "lucide-react";
import { 
  get48HourForecast, 
  analyzeForecastTrend, 
  generateEarlyWarnings,
  getBestOutdoorTime,
  getEmergencyContacts,
  ForecastData,
  EarlyWarning 
} from '@/lib/forecasting';
import { cn } from "@/lib/utils";

export function ForecastCard() {
  const [activeTab, setActiveTab] = useState('forecast');
  
  const forecast = get48HourForecast();
  const trend = analyzeForecastTrend();
  const warnings = generateEarlyWarnings();
  const bestTime = getBestOutdoorTime();
  const emergencyContacts = getEmergencyContacts();

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#00E400";
    if (aqi <= 100) return "#FFFF00";
    if (aqi <= 150) return "#FF7E00";
    if (aqi <= 200) return "#FF0000";
    if (aqi <= 300) return "#8F3F97";
    return "#7E0023";
  };

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            Air Quality Forecast & Early Warnings
          </CardTitle>
          <Badge className={cn("text-sm font-medium", getTrendColor(trend.trend))}>
            {getTrendIcon(trend.trend)}
            <span className="ml-1">{trend.trend.toUpperCase()}</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          48-hour forecast with early warning alerts for Delhi
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forecast">48h Forecast</TabsTrigger>
            <TabsTrigger value="warnings">Early Warnings</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-4">
            {/* Forecast Summary */}
            <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Forecast Summary</h3>
                <Badge className={cn("text-sm", getTrendColor(trend.trend))}>
                  {trend.trend.toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Peak AQI:</span> {trend.peakAQI}
                  <br />
                  <span className="text-muted-foreground">
                    {formatTime(trend.peakTime)} on {formatDate(trend.peakTime)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Current AQI:</span> {forecast[0].aqi}
                  <br />
                  <span className="text-muted-foreground">
                    {formatTime(forecast[0].timestamp)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">48h Forecast:</span> {forecast[forecast.length - 1].aqi}
                  <br />
                  <span className="text-muted-foreground">
                    {formatTime(forecast[forecast.length - 1].timestamp)}
                  </span>
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="space-y-3">
              <h3 className="font-semibold">Hourly Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {forecast.map((data, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">
                        {formatTime(data.timestamp)}
                      </div>
                      <Badge 
                        style={{ backgroundColor: getAQIColor(data.aqi), color: 'white' }}
                        className="text-xs"
                      >
                        {data.aqi}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Level: {data.aqiLevel}</div>
                      <div>Confidence: {data.confidence}%</div>
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3" />
                        {data.weather.temperature}°C
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="w-3 h-3" />
                        {data.weather.windSpeed} km/h {data.weather.windDirection}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {data.weather.visibility} km
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="warnings" className="space-y-4">
            {/* Active Warnings */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Active Early Warnings
              </h3>
              
              {warnings.length === 0 ? (
                <div className="p-4 border rounded-lg text-center text-muted-foreground">
                  No active warnings at this time
                </div>
              ) : (
                warnings.map((warning, index) => (
                  <div key={index} className="p-4 border rounded-lg border-red-200 bg-red-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-red-800">{warning.title}</h4>
                        <p className="text-sm text-red-700 mt-1">{warning.description}</p>
                      </div>
                      <Badge className={cn(
                        "text-xs",
                        warning.severity === 'severe' ? 'bg-red-600 text-white' :
                        warning.severity === 'high' ? 'bg-orange-600 text-white' :
                        'bg-yellow-600 text-white'
                      )}>
                        {warning.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-red-800">Affected Areas:</span>
                        <ul className="mt-1 space-y-1 text-red-700">
                          {warning.affectedAreas.map((area, idx) => (
                            <li key={idx}>• {area}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-red-800">Duration:</span>
                        <p className="text-red-700">{warning.duration}</p>
                        <span className="font-medium text-red-800 mt-2 block">Valid Until:</span>
                        <p className="text-red-700">
                          {warning.validUntil.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="font-medium text-red-800 mb-2">Recommendations:</h5>
                      <ul className="text-sm space-y-1 text-red-700">
                        {warning.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {warning.emergencyActions && (
                      <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
                        <h5 className="font-medium text-red-800 mb-2">Emergency Actions:</h5>
                        <ul className="text-sm space-y-1 text-red-700">
                          {warning.emergencyActions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {/* Trend Analysis */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                {getTrendIcon(trend.trend)}
                Trend Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Trend:</span> {trend.trend}
                  <br />
                  <span className="font-medium">Peak AQI:</span> {trend.peakAQI} at {formatTime(trend.peakTime)}
                  <br />
                  {trend.improvementTime && (
                    <>
                      <span className="font-medium">Improvement Expected:</span> {formatTime(trend.improvementTime)}
                    </>
                  )}
                </div>
                <div>
                  <span className="font-medium">Recommendations:</span>
                  <ul className="mt-1 space-y-1">
                    {trend.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Best Outdoor Time */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                Best Time for Outdoor Activities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-green-600">Best Time:</span>
                  <br />
                  {formatTime(bestTime.bestTime)} on {formatDate(bestTime.bestTime)}
                  <br />
                  <span className="text-muted-foreground">AQI: {bestTime.bestAQI}</span>
                </div>
                <div>
                  <span className="font-medium text-red-600">Worst Time:</span>
                  <br />
                  {formatTime(bestTime.worstTime)} on {formatDate(bestTime.worstTime)}
                  <br />
                  <span className="text-muted-foreground">AQI: {bestTime.worstAQI}</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="font-medium">Recommendations:</span>
                <ul className="mt-1 space-y-1">
                  {bestTime.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600" />
                Emergency Contacts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="font-medium">Emergency:</span>
                  <br />
                  {emergencyContacts.emergency}
                </div>
                <div>
                  <span className="font-medium">Ambulance:</span>
                  <br />
                  {emergencyContacts.ambulance}
                </div>
                <div>
                  <span className="font-medium">Police:</span>
                  <br />
                  {emergencyContacts.police}
                </div>
                <div>
                  <span className="font-medium">Fire:</span>
                  <br />
                  {emergencyContacts.fire}
                </div>
              </div>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Emergency Contacts
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 