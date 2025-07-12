// Forecasting and Early Warning System
// Based on meteorological data and machine learning models for Delhi

export interface ForecastData {
  timestamp: Date;
  aqi: number;
  aqiLevel: string;
  confidence: number;
  pollutants: {
    pm2_5: number;
    pm10: number;
    no2: number;
    o3: number;
    co: number;
    so2: number;
  };
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    visibility: number;
  };
}

export interface EarlyWarning {
  type: 'alert' | 'warning' | 'advisory';
  severity: 'low' | 'moderate' | 'high' | 'severe';
  title: string;
  description: string;
  affectedAreas: string[];
  duration: string;
  recommendations: string[];
  emergencyActions?: string[];
  issuedAt: Date;
  validUntil: Date;
}

export interface WeatherCondition {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  pressure: number;
  visibility: number;
  precipitation: number;
  cloudCover: number;
}

// Mock forecast data for Delhi (in real implementation, this would come from SAFAR/IITM Pune)
export const DELHI_FORECAST_DATA: ForecastData[] = [
  // Current time
  {
    timestamp: new Date(),
    aqi: 342,
    aqiLevel: "Very Unhealthy",
    confidence: 95,
    pollutants: {
      pm2_5: 142,
      pm10: 289,
      no2: 89,
      o3: 23,
      co: 2.1,
      so2: 45
    },
    weather: {
      temperature: 12,
      humidity: 78,
      windSpeed: 2,
      windDirection: "NW",
      pressure: 1013,
      visibility: 2.5
    }
  },
  
  // +6 hours
  {
    timestamp: new Date(Date.now() + 6 * 60 * 60 * 1000),
    aqi: 367,
    aqiLevel: "Very Unhealthy",
    confidence: 88,
    pollutants: {
      pm2_5: 156,
      pm10: 312,
      no2: 92,
      o3: 18,
      co: 2.4,
      so2: 52
    },
    weather: {
      temperature: 8,
      humidity: 85,
      windSpeed: 1,
      windDirection: "NW",
      pressure: 1012,
      visibility: 1.8
    }
  },
  
  // +12 hours
  {
    timestamp: new Date(Date.now() + 12 * 60 * 60 * 1000),
    aqi: 389,
    aqiLevel: "Hazardous",
    confidence: 82,
    pollutants: {
      pm2_5: 167,
      pm10: 334,
      no2: 95,
      o3: 15,
      co: 2.6,
      so2: 58
    },
    weather: {
      temperature: 6,
      humidity: 88,
      windSpeed: 0.5,
      windDirection: "NW",
      pressure: 1011,
      visibility: 1.2
    }
  },
  
  // +18 hours
  {
    timestamp: new Date(Date.now() + 18 * 60 * 60 * 1000),
    aqi: 412,
    aqiLevel: "Hazardous",
    confidence: 75,
    pollutants: {
      pm2_5: 178,
      pm10: 356,
      no2: 98,
      o3: 12,
      co: 2.8,
      so2: 64
    },
    weather: {
      temperature: 5,
      humidity: 90,
      windSpeed: 0.2,
      windDirection: "NW",
      pressure: 1010,
      visibility: 0.8
    }
  },
  
  // +24 hours
  {
    timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
    aqi: 398,
    aqiLevel: "Hazardous",
    confidence: 70,
    pollutants: {
      pm2_5: 172,
      pm10: 345,
      no2: 96,
      o3: 14,
      co: 2.7,
      so2: 61
    },
    weather: {
      temperature: 7,
      humidity: 87,
      windSpeed: 1.5,
      windDirection: "NW",
      pressure: 1012,
      visibility: 1.5
    }
  },
  
  // +30 hours
  {
    timestamp: new Date(Date.now() + 30 * 60 * 60 * 1000),
    aqi: 376,
    aqiLevel: "Very Unhealthy",
    confidence: 65,
    pollutants: {
      pm2_5: 162,
      pm10: 323,
      no2: 93,
      o3: 16,
      co: 2.5,
      so2: 55
    },
    weather: {
      temperature: 9,
      humidity: 83,
      windSpeed: 3,
      windDirection: "NW",
      pressure: 1013,
      visibility: 2.0
    }
  },
  
  // +36 hours
  {
    timestamp: new Date(Date.now() + 36 * 60 * 60 * 1000),
    aqi: 345,
    aqiLevel: "Very Unhealthy",
    confidence: 60,
    pollutants: {
      pm2_5: 148,
      pm10: 295,
      no2: 90,
      o3: 20,
      co: 2.3,
      so2: 48
    },
    weather: {
      temperature: 11,
      humidity: 80,
      windSpeed: 4,
      windDirection: "NW",
      pressure: 1014,
      visibility: 2.8
    }
  },
  
  // +42 hours
  {
    timestamp: new Date(Date.now() + 42 * 60 * 60 * 1000),
    aqi: 312,
    aqiLevel: "Very Unhealthy",
    confidence: 55,
    pollutants: {
      pm2_5: 134,
      pm10: 267,
      no2: 87,
      o3: 24,
      co: 2.1,
      so2: 42
    },
    weather: {
      temperature: 13,
      humidity: 77,
      windSpeed: 5,
      windDirection: "NW",
      pressure: 1015,
      visibility: 3.5
    }
  },
  
  // +48 hours
  {
    timestamp: new Date(Date.now() + 48 * 60 * 60 * 1000),
    aqi: 289,
    aqiLevel: "Unhealthy",
    confidence: 50,
    pollutants: {
      pm2_5: 123,
      pm10: 245,
      no2: 84,
      o3: 28,
      co: 1.9,
      so2: 38
    },
    weather: {
      temperature: 15,
      humidity: 74,
      windSpeed: 6,
      windDirection: "NW",
      pressure: 1016,
      visibility: 4.2
    }
  }
];

// Early warning alerts for Delhi
export const ACTIVE_EARLY_WARNINGS: EarlyWarning[] = [
  {
    type: 'alert',
    severity: 'severe',
    title: 'Hazardous Air Quality Alert',
    description: 'Delhi is experiencing hazardous air quality conditions with AQI exceeding 400. This poses serious health risks to all residents.',
    affectedAreas: ['All Delhi areas', 'NCR regions'],
    duration: 'Next 24-48 hours',
    recommendations: [
      'Stay indoors completely',
      'Use air purifiers continuously',
      'Avoid all outdoor activities',
      'Wear N95 masks if going out',
      'Monitor health closely'
    ],
    emergencyActions: [
      'Seek medical attention for severe symptoms',
      'Call emergency services if breathing difficulties',
      'Use rescue medications as prescribed',
      'Consider evacuation to cleaner areas'
    ],
    issuedAt: new Date(),
    validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000)
  },
  {
    type: 'warning',
    severity: 'high',
    title: 'Stubble Burning Impact',
    description: 'Stubble burning in neighboring states is contributing to poor air quality in Delhi.',
    affectedAreas: ['North Delhi', 'East Delhi', 'Central Delhi'],
    duration: 'Next 72 hours',
    recommendations: [
      'Limit outdoor activities',
      'Use air purifiers',
      'Monitor air quality updates',
      'Stay hydrated'
    ],
    issuedAt: new Date(),
    validUntil: new Date(Date.now() + 72 * 60 * 60 * 1000)
  }
];

// Get forecast for specific time
export function getForecastForTime(targetTime: Date): ForecastData | null {
  return DELHI_FORECAST_DATA.find(forecast => 
    Math.abs(forecast.timestamp.getTime() - targetTime.getTime()) < 60 * 60 * 1000 // Within 1 hour
  ) || null;
}

// Get 48-hour forecast
export function get48HourForecast(): ForecastData[] {
  return DELHI_FORECAST_DATA;
}

// Analyze forecast trend
export function analyzeForecastTrend(): {
  trend: 'improving' | 'worsening' | 'stable';
  peakTime: Date;
  peakAQI: number;
  improvementTime?: Date;
  recommendations: string[];
} {
  const forecast = DELHI_FORECAST_DATA;
  const currentAQI = forecast[0].aqi;
  const peakForecast = forecast.reduce((max, f) => f.aqi > max.aqi ? f : max);
  const endForecast = forecast[forecast.length - 1];
  
  let trend: 'improving' | 'worsening' | 'stable' = 'stable';
  if (endForecast.aqi < currentAQI - 20) trend = 'improving';
  else if (peakForecast.aqi > currentAQI + 20) trend = 'worsening';
  
  const recommendations = [];
  if (trend === 'worsening') {
    recommendations.push('Air quality expected to worsen - prepare accordingly');
    recommendations.push('Stock up on masks and air purifier filters');
    recommendations.push('Plan indoor activities for peak pollution hours');
  } else if (trend === 'improving') {
    recommendations.push('Air quality expected to improve gradually');
    recommendations.push('Continue precautions until significant improvement');
  } else {
    recommendations.push('Air quality expected to remain stable');
    recommendations.push('Continue current precautions');
  }
  
  return {
    trend,
    peakTime: peakForecast.timestamp,
    peakAQI: peakForecast.aqi,
    improvementTime: trend === 'improving' ? endForecast.timestamp : undefined,
    recommendations
  };
}

// Generate early warnings based on forecast
export function generateEarlyWarnings(): EarlyWarning[] {
  const warnings: EarlyWarning[] = [];
  const forecast = DELHI_FORECAST_DATA;
  
  // Check for hazardous conditions
  const hazardousHours = forecast.filter(f => f.aqi >= 300).length;
  if (hazardousHours >= 6) {
    warnings.push({
      type: 'alert',
      severity: 'severe',
      title: 'Extended Hazardous Air Quality',
      description: `Hazardous air quality conditions expected for ${hazardousHours} hours`,
      affectedAreas: ['All Delhi areas'],
      duration: `${hazardousHours} hours`,
      recommendations: [
        'Stay indoors completely',
        'Use air purifiers 24/7',
        'Avoid all outdoor activities',
        'Monitor health constantly'
      ],
      emergencyActions: [
        'Seek medical attention for severe symptoms',
        'Call emergency services if needed',
        'Use rescue medications as prescribed'
      ],
      issuedAt: new Date(),
      validUntil: new Date(Date.now() + hazardousHours * 60 * 60 * 1000)
    });
  }
  
  // Check for worsening conditions
  const trend = analyzeForecastTrend();
  if (trend.trend === 'worsening' && trend.peakAQI > 200) {
    warnings.push({
      type: 'warning',
      severity: 'high',
      title: 'Air Quality Deterioration Expected',
      description: `Air quality expected to worsen to ${trend.peakAQI} AQI by ${trend.peakTime.toLocaleString()}`,
      affectedAreas: ['All Delhi areas'],
      duration: 'Next 24 hours',
      recommendations: [
        'Prepare for worsening conditions',
        'Stock up on protective equipment',
        'Plan indoor activities',
        'Monitor air quality updates'
      ],
      issuedAt: new Date(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  }
  
  return warnings;
}

// Get weather-based predictions
export function getWeatherBasedPredictions(weather: WeatherCondition): {
  impact: 'positive' | 'negative' | 'neutral';
  factors: string[];
  recommendations: string[];
} {
  const factors: string[] = [];
  const recommendations: string[] = [];
  let impact: 'positive' | 'negative' | 'neutral' = 'neutral';
  
  // Wind speed analysis
  if (weather.windSpeed > 10) {
    factors.push('High wind speed - may disperse pollutants');
    impact = 'positive';
    recommendations.push('Wind may improve air quality');
  } else if (weather.windSpeed < 2) {
    factors.push('Low wind speed - pollutants may accumulate');
    impact = 'negative';
    recommendations.push('Low wind may worsen air quality');
  }
  
  // Humidity analysis
  if (weather.humidity > 80) {
    factors.push('High humidity - may trap pollutants');
    impact = 'negative';
    recommendations.push('High humidity may worsen air quality');
  } else if (weather.humidity < 30) {
    factors.push('Low humidity - may increase dust');
    impact = 'negative';
    recommendations.push('Low humidity may increase dust levels');
  }
  
  // Temperature analysis
  if (weather.temperature < 10) {
    factors.push('Low temperature - may cause temperature inversion');
    impact = 'negative';
    recommendations.push('Cold weather may trap pollutants near ground');
  }
  
  // Visibility analysis
  if (weather.visibility < 2) {
    factors.push('Poor visibility - indicates high pollution');
    impact = 'negative';
    recommendations.push('Poor visibility suggests high pollution levels');
  }
  
  return { impact, factors, recommendations };
}

// Get best time for outdoor activities
export function getBestOutdoorTime(): {
  bestTime: Date;
  bestAQI: number;
  worstTime: Date;
  worstAQI: number;
  recommendations: string[];
} {
  const forecast = DELHI_FORECAST_DATA;
  const bestForecast = forecast.reduce((min, f) => f.aqi < min.aqi ? f : min);
  const worstForecast = forecast.reduce((max, f) => f.aqi > max.aqi ? f : max);
  
  const recommendations = [];
  if (bestForecast.aqi <= 100) {
    recommendations.push('Good time for outdoor activities');
    recommendations.push('Consider light exercise');
  } else if (bestForecast.aqi <= 150) {
    recommendations.push('Moderate air quality - limit outdoor time');
    recommendations.push('Sensitive groups should stay indoors');
  } else {
    recommendations.push('Poor air quality - avoid outdoor activities');
    recommendations.push('Stay indoors with air purifiers');
  }
  
  return {
    bestTime: bestForecast.timestamp,
    bestAQI: bestForecast.aqi,
    worstTime: worstForecast.timestamp,
    worstAQI: worstForecast.aqi,
    recommendations
  };
}

// Get emergency contacts for severe conditions
export function getEmergencyContacts(): {
  emergency: string;
  ambulance: string;
  police: string;
  fire: string;
  helplines: { [key: string]: string };
} {
  return {
    emergency: "112",
    ambulance: "102",
    police: "100",
    fire: "101",
    helplines: {
      "Women Helpline": "1091",
      "Child Helpline": "1098",
      "Senior Citizen Helpline": "14567",
      "Mental Health Helpline": "1800-599-0019",
      "Delhi Pollution Control": "011-23417600"
    }
  };
} 