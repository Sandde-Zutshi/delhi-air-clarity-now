// Utility functions for pollutant status calculation

export interface PollutantLimits {
  good: number;
  moderate: number;
  unhealthy: number;
  critical: number;
}

// WHO and EPA standards for pollutants
export const POLLUTANT_LIMITS: Record<string, PollutantLimits> = {
  'PM2.5': {
    good: 12,      // μg/m³
    moderate: 35,
    unhealthy: 55,
    critical: 150
  },
  'PM10': {
    good: 54,      // μg/m³
    moderate: 154,
    unhealthy: 254,
    critical: 354
  },
  'NO2': {
    good: 53,      // ppb
    moderate: 100,
    unhealthy: 360,
    critical: 649
  },
  'CO': {
    good: 4.4,     // ppm
    moderate: 9.4,
    unhealthy: 12.4,
    critical: 15.4
  },
  'O3': {
    good: 54,      // ppb
    moderate: 70,
    unhealthy: 85,
    critical: 105
  },
  'SO2': {
    good: 35,      // ppb
    moderate: 75,
    unhealthy: 185,
    critical: 304
  }
};

export function getPollutantStatus(name: string, value: number): 'good' | 'moderate' | 'unhealthy' | 'critical' {
  const limits = POLLUTANT_LIMITS[name];
  
  if (!limits) {
    // Default to moderate if no limits defined
    return 'moderate';
  }
  
  if (value <= limits.good) return 'good';
  if (value <= limits.moderate) return 'moderate';
  if (value <= limits.unhealthy) return 'unhealthy';
  return 'critical';
}

export function getPollutantTrend(value: number, previousValue?: number): 'up' | 'down' | 'stable' {
  if (!previousValue) return 'stable';
  
  const change = value - previousValue;
  const changePercent = Math.abs(change / previousValue) * 100;
  
  // Only show trend if change is significant (>5%)
  if (changePercent < 5) return 'stable';
  
  return change > 0 ? 'up' : 'down';
}

export function getTrendValue(value: number, previousValue?: number): number {
  if (!previousValue) return 0;
  
  return Math.round(Math.abs((value - previousValue) / previousValue) * 100);
} 