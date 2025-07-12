// Historical Data and Trend Analysis System
// Based on CPCB data and seasonal patterns for Delhi

export interface HistoricalDataPoint {
  date: Date;
  aqi: number;
  pm2_5: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
}

export interface TrendAnalysis {
  period: '24h' | '7d' | '30d' | 'seasonal';
  averageAQI: number;
  trend: 'improving' | 'worsening' | 'stable';
  changePercentage: number;
  bestTime: string;
  worstTime: string;
  recommendations: string[];
}

export interface SeasonalPattern {
  season: 'winter' | 'summer' | 'monsoon' | 'post-monsoon';
  averageAQI: number;
  peakHours: string[];
  commonSources: string[];
  healthRisks: string[];
  recommendations: string[];
}

export interface CityComparison {
  city: string;
  currentAQI: number;
  rank: number;
  trend: 'improving' | 'worsening' | 'stable';
  majorSources: string[];
  population: number;
  area: number;
}

// Mock historical data for Delhi (in real implementation, this would come from APIs)
export const DELHI_HISTORICAL_DATA: HistoricalDataPoint[] = [
  // Winter data (November - February)
  { date: new Date('2024-01-15T06:00:00'), aqi: 342, pm2_5: 142, pm10: 289, no2: 89, o3: 23, co: 2.1, so2: 45, temperature: 8, humidity: 85, windSpeed: 2 },
  { date: new Date('2024-01-15T12:00:00'), aqi: 298, pm2_5: 118, pm10: 245, no2: 76, o3: 34, co: 1.8, so2: 38, temperature: 15, humidity: 65, windSpeed: 4 },
  { date: new Date('2024-01-15T18:00:00'), aqi: 387, pm2_5: 156, pm10: 312, no2: 92, o3: 18, co: 2.4, so2: 52, temperature: 12, humidity: 78, windSpeed: 1 },
  
  // Summer data (March - June)
  { date: new Date('2024-05-15T06:00:00'), aqi: 156, pm2_5: 65, pm10: 134, no2: 45, o3: 78, co: 1.2, so2: 23, temperature: 28, humidity: 45, windSpeed: 6 },
  { date: new Date('2024-05-15T12:00:00'), aqi: 189, pm2_5: 78, pm10: 156, no2: 52, o3: 89, co: 1.4, so2: 28, temperature: 38, humidity: 35, windSpeed: 8 },
  { date: new Date('2024-05-15T18:00:00'), aqi: 167, pm2_5: 69, pm10: 142, no2: 48, o3: 82, co: 1.3, so2: 25, temperature: 32, humidity: 55, windSpeed: 5 },
  
  // Monsoon data (July - September)
  { date: new Date('2024-08-15T06:00:00'), aqi: 89, pm2_5: 34, pm10: 67, no2: 28, o3: 45, co: 0.8, so2: 15, temperature: 26, humidity: 88, windSpeed: 12 },
  { date: new Date('2024-08-15T12:00:00'), aqi: 67, pm2_5: 23, pm10: 45, no2: 22, o3: 38, co: 0.6, so2: 12, temperature: 30, humidity: 82, windSpeed: 15 },
  { date: new Date('2024-08-15T18:00:00'), aqi: 78, pm2_5: 28, pm10: 56, no2: 25, o3: 42, co: 0.7, so2: 14, temperature: 28, humidity: 85, windSpeed: 10 },
  
  // Post-monsoon data (October)
  { date: new Date('2024-10-15T06:00:00'), aqi: 234, pm2_5: 98, pm10: 189, no2: 67, o3: 56, co: 1.6, so2: 34, temperature: 22, humidity: 72, windSpeed: 3 },
  { date: new Date('2024-10-15T12:00:00'), aqi: 198, pm2_5: 82, pm10: 156, no2: 58, o3: 62, co: 1.4, so2: 29, temperature: 28, humidity: 58, windSpeed: 5 },
  { date: new Date('2024-10-15T18:00:00'), aqi: 267, pm2_5: 112, pm10: 223, no2: 73, o3: 48, co: 1.8, so2: 38, temperature: 24, humidity: 68, windSpeed: 2 },
];

// Seasonal patterns for Delhi
export const DELHI_SEASONAL_PATTERNS: SeasonalPattern[] = [
  {
    season: 'winter',
    averageAQI: 320,
    peakHours: ['6:00 AM - 10:00 AM', '6:00 PM - 10:00 PM'],
    commonSources: [
      'Stubble burning in neighboring states',
      'Vehicle emissions',
      'Industrial emissions',
      'Construction dust',
      'Low wind speeds and temperature inversion'
    ],
    healthRisks: [
      'Severe respiratory problems',
      'Increased risk of heart attacks',
      'Eye and throat irritation',
      'Reduced lung function'
    ],
    recommendations: [
      'Stay indoors during peak hours',
      'Use air purifiers continuously',
      'Wear N95 masks outdoors',
      'Avoid outdoor exercise',
      'Monitor air quality updates'
    ]
  },
  {
    season: 'summer',
    averageAQI: 170,
    peakHours: ['12:00 PM - 4:00 PM', '6:00 PM - 8:00 PM'],
    commonSources: [
      'Dust storms from Rajasthan',
      'Vehicle emissions',
      'Industrial emissions',
      'High temperatures and low humidity',
      'Ozone formation'
    ],
    healthRisks: [
      'Heat-related illnesses',
      'Respiratory discomfort',
      'Eye irritation',
      'Dehydration'
    ],
    recommendations: [
      'Stay hydrated',
      'Avoid outdoor activities during peak hours',
      'Use air conditioning',
      'Monitor ozone levels',
      'Stay in shaded areas'
    ]
  },
  {
    season: 'monsoon',
    averageAQI: 78,
    peakHours: ['During heavy rainfall', 'After rainfall'],
    commonSources: [
      'Wet dust resuspension',
      'Vehicle emissions',
      'Industrial emissions',
      'High humidity'
    ],
    healthRisks: [
      'Mold and fungal growth',
      'Respiratory infections',
      'Allergic reactions'
    ],
    recommendations: [
      'Use dehumidifiers',
      'Maintain good ventilation',
      'Clean air filters regularly',
      'Monitor humidity levels'
    ]
  },
  {
    season: 'post-monsoon',
    averageAQI: 233,
    peakHours: ['6:00 AM - 10:00 AM', '5:00 PM - 9:00 PM'],
    commonSources: [
      'Stubble burning begins',
      'Vehicle emissions',
      'Industrial emissions',
      'Construction activities',
      'Festival fireworks'
    ],
    healthRisks: [
      'Respiratory problems',
      'Eye and throat irritation',
      'Allergic reactions',
      'Reduced visibility'
    ],
    recommendations: [
      'Limit outdoor activities',
      'Use air purifiers',
      'Wear masks during peak hours',
      'Monitor air quality closely',
      'Avoid burning activities'
    ]
  }
];

// Indian cities comparison data
export const INDIAN_CITIES_COMPARISON: CityComparison[] = [
  {
    city: 'Delhi',
    currentAQI: 342,
    rank: 1,
    trend: 'worsening',
    majorSources: ['Vehicle emissions', 'Industrial pollution', 'Stubble burning', 'Construction dust'],
    population: 20000000,
    area: 1484
  },
  {
    city: 'Mumbai',
    currentAQI: 156,
    rank: 2,
    trend: 'stable',
    majorSources: ['Vehicle emissions', 'Industrial pollution', 'Marine aerosols'],
    population: 20400000,
    area: 603
  },
  {
    city: 'Kolkata',
    currentAQI: 178,
    rank: 3,
    trend: 'improving',
    majorSources: ['Vehicle emissions', 'Industrial pollution', 'Biomass burning'],
    population: 14900000,
    area: 185
  },
  {
    city: 'Chennai',
    currentAQI: 134,
    rank: 4,
    trend: 'stable',
    majorSources: ['Vehicle emissions', 'Industrial pollution', 'Sea breeze'],
    population: 11400000,
    area: 426
  },
  {
    city: 'Bangalore',
    currentAQI: 98,
    rank: 5,
    trend: 'improving',
    majorSources: ['Vehicle emissions', 'Construction dust', 'Industrial pollution'],
    population: 13100000,
    area: 709
  },
  {
    city: 'Hyderabad',
    currentAQI: 112,
    rank: 6,
    trend: 'stable',
    majorSources: ['Vehicle emissions', 'Industrial pollution', 'Construction activities'],
    population: 10400000,
    area: 650
  },
  {
    city: 'Pune',
    currentAQI: 89,
    rank: 7,
    trend: 'improving',
    majorSources: ['Vehicle emissions', 'Industrial pollution'],
    population: 7000000,
    area: 331
  },
  {
    city: 'Ahmedabad',
    currentAQI: 145,
    rank: 8,
    trend: 'worsening',
    majorSources: ['Vehicle emissions', 'Industrial pollution', 'Dust storms'],
    population: 8000000,
    area: 464
  }
];

// Get current season
export function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 11 || month <= 1) return 'winter';
  if (month >= 2 && month <= 5) return 'summer';
  if (month >= 6 && month <= 9) return 'monsoon';
  return 'post-monsoon';
}

// Get seasonal pattern for current season
export function getCurrentSeasonalPattern(): SeasonalPattern {
  const currentSeason = getCurrentSeason();
  return DELHI_SEASONAL_PATTERNS.find(pattern => pattern.season === currentSeason) || DELHI_SEASONAL_PATTERNS[0];
}

// Analyze 24-hour trend
export function analyze24HourTrend(data: HistoricalDataPoint[]): TrendAnalysis {
  const last24Hours = data.slice(-24);
  const averageAQI = last24Hours.reduce((sum, point) => sum + point.aqi, 0) / last24Hours.length;
  
  const firstHalf = last24Hours.slice(0, 12);
  const secondHalf = last24Hours.slice(12);
  const firstHalfAvg = firstHalf.reduce((sum, point) => sum + point.aqi, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, point) => sum + point.aqi, 0) / secondHalf.length;
  
  const changePercentage = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  
  const bestTime = last24Hours.reduce((min, point) => point.aqi < min.aqi ? point : min).date.toLocaleTimeString();
  const worstTime = last24Hours.reduce((max, point) => point.aqi > max.aqi ? point : max).date.toLocaleTimeString();
  
  let trend: 'improving' | 'worsening' | 'stable' = 'stable';
  if (changePercentage > 10) trend = 'worsening';
  else if (changePercentage < -10) trend = 'improving';
  
  const recommendations = [];
  if (trend === 'worsening') {
    recommendations.push('Air quality is deteriorating - take precautions');
    recommendations.push('Limit outdoor activities');
    recommendations.push('Use air purifiers if available');
  } else if (trend === 'improving') {
    recommendations.push('Air quality is improving');
    recommendations.push('Still monitor for sensitive individuals');
  } else {
    recommendations.push('Air quality is stable');
    recommendations.push('Continue current precautions');
  }
  
  return {
    period: '24h',
    averageAQI: Math.round(averageAQI),
    trend,
    changePercentage: Math.round(changePercentage),
    bestTime,
    worstTime,
    recommendations
  };
}

// Get city ranking
export function getCityRanking(cityName: string): CityComparison | null {
  return INDIAN_CITIES_COMPARISON.find(city => city.city.toLowerCase() === cityName.toLowerCase()) || null;
}

// Get top polluted cities
export function getTopPollutedCities(limit: number = 5): CityComparison[] {
  return INDIAN_CITIES_COMPARISON
    .sort((a, b) => b.currentAQI - a.currentAQI)
    .slice(0, limit);
}

// Generate historical insights
export function generateHistoricalInsights(data: HistoricalDataPoint[]): string[] {
  const insights: string[] = [];
  
  // Find worst day
  const worstDay = data.reduce((max, point) => point.aqi > max.aqi ? point : max);
  insights.push(`Worst air quality recorded: ${worstDay.aqi} AQI on ${worstDay.date.toLocaleDateString()}`);
  
  // Find best day
  const bestDay = data.reduce((min, point) => point.aqi < min.aqi ? point : min);
  insights.push(`Best air quality recorded: ${bestDay.aqi} AQI on ${bestDay.date.toLocaleDateString()}`);
  
  // Calculate average
  const averageAQI = data.reduce((sum, point) => sum + point.aqi, 0) / data.length;
  insights.push(`Average AQI over the period: ${Math.round(averageAQI)}`);
  
  // Seasonal pattern
  const currentSeason = getCurrentSeason();
  const seasonalPattern = getCurrentSeasonalPattern();
  insights.push(`Current season (${currentSeason}): Average AQI is ${seasonalPattern.averageAQI}`);
  
  return insights;
}

// Export data for download
export function exportHistoricalData(data: HistoricalDataPoint[], format: 'csv' | 'json' = 'csv'): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  
  // CSV format
  const headers = ['Date', 'AQI', 'PM2.5', 'PM10', 'NO2', 'O3', 'CO', 'SO2', 'Temperature', 'Humidity', 'WindSpeed'];
  const rows = data.map(point => [
    point.date.toISOString(),
    point.aqi,
    point.pm2_5,
    point.pm10,
    point.no2,
    point.o3,
    point.co,
    point.so2,
    point.temperature || '',
    point.humidity || '',
    point.windSpeed || ''
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
} 