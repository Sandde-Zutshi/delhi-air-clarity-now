// Utility functions for pollutant status calculation

export interface PollutantLimits {
  good: number;
  moderate: number;
  unhealthy: number;
  critical: number;
}

// Pollutant Limits based on WHO and EPA Standards
export const POLLUTANT_LIMITS: Record<string, PollutantLimits> = {
  'PM2.5': {
    good: 12,      // μg/m³ - WHO guideline
    moderate: 35,  // μg/m³ - WHO interim target 1
    unhealthy: 55, // μg/m³ - WHO interim target 2
    critical: 150  // μg/m³ - WHO interim target 3
  },
  'PM10': {
    good: 20,      // μg/m³ - WHO guideline
    moderate: 50,  // μg/m³ - WHO interim target 1
    unhealthy: 100, // μg/m³ - WHO interim target 2
    critical: 250  // μg/m³ - WHO interim target 3
  },
  'NO2': {
    good: 40,      // μg/m³ - WHO guideline (annual)
    moderate: 100, // μg/m³ - WHO interim target
    unhealthy: 200, // μg/m³ - High exposure
    critical: 400  // μg/m³ - Very high exposure
  },
  'CO': {
    good: 4,       // mg/m³ - WHO guideline (8-hour)
    moderate: 9,   // mg/m³ - Moderate exposure
    unhealthy: 15, // mg/m³ - High exposure
    critical: 30   // mg/m³ - Very high exposure
  },
  'O3': {
    good: 100,     // μg/m³ - WHO guideline (8-hour)
    moderate: 160, // μg/m³ - Moderate exposure
    unhealthy: 240, // μg/m³ - High exposure
    critical: 400  // μg/m³ - Very high exposure
  },
  'SO2': {
    good: 20,      // μg/m³ - WHO guideline (24-hour)
    moderate: 125, // μg/m³ - WHO interim target
    unhealthy: 250, // μg/m³ - High exposure
    critical: 500  // μg/m³ - Very high exposure
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

// Pollutant Color System - 16+ Ranges (similar to AQI)
export interface PollutantColorInfo {
  hex: string;
  gradient: [string, string];
  textColor: string;
  borderColor: string;
}

// Example color scale (adjust as needed for each pollutant)
export const POLLUTANT_COLORS: Record<string, PollutantColorInfo[]> = {
  'PM2.5': [
    { hex: '#00E400', gradient: ['#00E400', '#00C400'], textColor: '#000', borderColor: '#00E400' }, // 0-12
    { hex: '#7CFC00', gradient: ['#7CFC00', '#6BDB00'], textColor: '#000', borderColor: '#7CFC00' }, // 13-25
    { hex: '#ADFF2F', gradient: ['#ADFF2F', '#9CEE1E'], textColor: '#000', borderColor: '#ADFF2F' }, // 26-35
    { hex: '#FFFF00', gradient: ['#FFFF00', '#EEEE00'], textColor: '#000', borderColor: '#FFFF00' }, // 36-50
    { hex: '#FFA500', gradient: ['#FFA500', '#EE9400'], textColor: '#fff', borderColor: '#FFA500' }, // 51-75
    { hex: '#FF8C00', gradient: ['#FF8C00', '#EE7B00'], textColor: '#fff', borderColor: '#FF8C00' }, // 76-100
    { hex: '#FF0000', gradient: ['#FF0000', '#EE0000'], textColor: '#fff', borderColor: '#FF0000' }, // 101-125
    { hex: '#B22222', gradient: ['#B22222', '#A11111'], textColor: '#fff', borderColor: '#B22222' }, // 126-150
    { hex: '#8A2BE2', gradient: ['#8A2BE2', '#791AD1'], textColor: '#fff', borderColor: '#8A2BE2' }, // 151-175
    { hex: '#800080', gradient: ['#800080', '#6F006F'], textColor: '#fff', borderColor: '#800080' }, // 176-200
    { hex: '#800000', gradient: ['#800000', '#6F0000'], textColor: '#fff', borderColor: '#800000' }, // 201-225
    { hex: '#A52A2A', gradient: ['#A52A2A', '#941919'], textColor: '#fff', borderColor: '#A52A2A' }, // 226-250
    { hex: '#4B0000', gradient: ['#4B0000', '#3A0000'], textColor: '#fff', borderColor: '#4B0000' }, // 251-275
    { hex: '#2F1B1B', gradient: ['#2F1B1B', '#1E0A0A'], textColor: '#fff', borderColor: '#2F1B1B' }, // 276-300
    { hex: '#1C1C1C', gradient: ['#1C1C1C', '#0B0B0B'], textColor: '#fff', borderColor: '#1C1C1C' }, // 301-350
    { hex: '#000000', gradient: ['#000000', '#000000'], textColor: '#fff', borderColor: '#FF0000' }, // 351+
  ],
  // Repeat for other pollutants as needed (for demo, use same scale)
  'PM10': [
    { hex: '#00E400', gradient: ['#00E400', '#00C400'], textColor: '#000', borderColor: '#00E400' },
    { hex: '#7CFC00', gradient: ['#7CFC00', '#6BDB00'], textColor: '#000', borderColor: '#7CFC00' },
    { hex: '#ADFF2F', gradient: ['#ADFF2F', '#9CEE1E'], textColor: '#000', borderColor: '#ADFF2F' },
    { hex: '#FFFF00', gradient: ['#FFFF00', '#EEEE00'], textColor: '#000', borderColor: '#FFFF00' },
    { hex: '#FFA500', gradient: ['#FFA500', '#EE9400'], textColor: '#fff', borderColor: '#FFA500' },
    { hex: '#FF8C00', gradient: ['#FF8C00', '#EE7B00'], textColor: '#fff', borderColor: '#FF8C00' },
    { hex: '#FF0000', gradient: ['#FF0000', '#EE0000'], textColor: '#fff', borderColor: '#FF0000' },
    { hex: '#B22222', gradient: ['#B22222', '#A11111'], textColor: '#fff', borderColor: '#B22222' },
    { hex: '#8A2BE2', gradient: ['#8A2BE2', '#791AD1'], textColor: '#fff', borderColor: '#8A2BE2' },
    { hex: '#800080', gradient: ['#800080', '#6F006F'], textColor: '#fff', borderColor: '#800080' },
    { hex: '#800000', gradient: ['#800000', '#6F0000'], textColor: '#fff', borderColor: '#800000' },
    { hex: '#A52A2A', gradient: ['#A52A2A', '#941919'], textColor: '#fff', borderColor: '#A52A2A' },
    { hex: '#4B0000', gradient: ['#4B0000', '#3A0000'], textColor: '#fff', borderColor: '#4B0000' },
    { hex: '#2F1B1B', gradient: ['#2F1B1B', '#1E0A0A'], textColor: '#fff', borderColor: '#2F1B1B' },
    { hex: '#1C1C1C', gradient: ['#1C1C1C', '#0B0B0B'], textColor: '#fff', borderColor: '#1C1C1C' },
    { hex: '#000000', gradient: ['#000000', '#000000'], textColor: '#fff', borderColor: '#FF0000' },
  ],
  // For demo, use same for all
  'NO2': [
    { hex: '#00E400', gradient: ['#00E400', '#00C400'], textColor: '#000', borderColor: '#00E400' },
    { hex: '#7CFC00', gradient: ['#7CFC00', '#6BDB00'], textColor: '#000', borderColor: '#7CFC00' },
    { hex: '#ADFF2F', gradient: ['#ADFF2F', '#9CEE1E'], textColor: '#000', borderColor: '#ADFF2F' },
    { hex: '#FFFF00', gradient: ['#FFFF00', '#EEEE00'], textColor: '#000', borderColor: '#FFFF00' },
    { hex: '#FFA500', gradient: ['#FFA500', '#EE9400'], textColor: '#fff', borderColor: '#FFA500' },
    { hex: '#FF8C00', gradient: ['#FF8C00', '#EE7B00'], textColor: '#fff', borderColor: '#FF8C00' },
    { hex: '#FF0000', gradient: ['#FF0000', '#EE0000'], textColor: '#fff', borderColor: '#FF0000' },
    { hex: '#B22222', gradient: ['#B22222', '#A11111'], textColor: '#fff', borderColor: '#B22222' },
    { hex: '#8A2BE2', gradient: ['#8A2BE2', '#791AD1'], textColor: '#fff', borderColor: '#8A2BE2' },
    { hex: '#800080', gradient: ['#800080', '#6F006F'], textColor: '#fff', borderColor: '#800080' },
    { hex: '#800000', gradient: ['#800000', '#6F0000'], textColor: '#fff', borderColor: '#800000' },
    { hex: '#A52A2A', gradient: ['#A52A2A', '#941919'], textColor: '#fff', borderColor: '#A52A2A' },
    { hex: '#4B0000', gradient: ['#4B0000', '#3A0000'], textColor: '#fff', borderColor: '#4B0000' },
    { hex: '#2F1B1B', gradient: ['#2F1B1B', '#1E0A0A'], textColor: '#fff', borderColor: '#2F1B1B' },
    { hex: '#1C1C1C', gradient: ['#1C1C1C', '#0B0B0B'], textColor: '#fff', borderColor: '#1C1C1C' },
    { hex: '#000000', gradient: ['#000000', '#000000'], textColor: '#fff', borderColor: '#FF0000' },
  ],
  'CO': [
    { hex: '#00E400', gradient: ['#00E400', '#00C400'], textColor: '#000', borderColor: '#00E400' },
    { hex: '#7CFC00', gradient: ['#7CFC00', '#6BDB00'], textColor: '#000', borderColor: '#7CFC00' },
    { hex: '#ADFF2F', gradient: ['#ADFF2F', '#9CEE1E'], textColor: '#000', borderColor: '#ADFF2F' },
    { hex: '#FFFF00', gradient: ['#FFFF00', '#EEEE00'], textColor: '#000', borderColor: '#FFFF00' },
    { hex: '#FFA500', gradient: ['#FFA500', '#EE9400'], textColor: '#fff', borderColor: '#FFA500' },
    { hex: '#FF8C00', gradient: ['#FF8C00', '#EE7B00'], textColor: '#fff', borderColor: '#FF8C00' },
    { hex: '#FF0000', gradient: ['#FF0000', '#EE0000'], textColor: '#fff', borderColor: '#FF0000' },
    { hex: '#B22222', gradient: ['#B22222', '#A11111'], textColor: '#fff', borderColor: '#B22222' },
    { hex: '#8A2BE2', gradient: ['#8A2BE2', '#791AD1'], textColor: '#fff', borderColor: '#8A2BE2' },
    { hex: '#800080', gradient: ['#800080', '#6F006F'], textColor: '#fff', borderColor: '#800080' },
    { hex: '#800000', gradient: ['#800000', '#6F0000'], textColor: '#fff', borderColor: '#800000' },
    { hex: '#A52A2A', gradient: ['#A52A2A', '#941919'], textColor: '#fff', borderColor: '#A52A2A' },
    { hex: '#4B0000', gradient: ['#4B0000', '#3A0000'], textColor: '#fff', borderColor: '#4B0000' },
    { hex: '#2F1B1B', gradient: ['#2F1B1B', '#1E0A0A'], textColor: '#fff', borderColor: '#2F1B1B' },
    { hex: '#1C1C1C', gradient: ['#1C1C1C', '#0B0B0B'], textColor: '#fff', borderColor: '#1C1C1C' },
    { hex: '#000000', gradient: ['#000000', '#000000'], textColor: '#fff', borderColor: '#FF0000' },
  ],
  'O3': [
    { hex: '#00E400', gradient: ['#00E400', '#00C400'], textColor: '#000', borderColor: '#00E400' },
    { hex: '#7CFC00', gradient: ['#7CFC00', '#6BDB00'], textColor: '#000', borderColor: '#7CFC00' },
    { hex: '#ADFF2F', gradient: ['#ADFF2F', '#9CEE1E'], textColor: '#000', borderColor: '#ADFF2F' },
    { hex: '#FFFF00', gradient: ['#FFFF00', '#EEEE00'], textColor: '#000', borderColor: '#FFFF00' },
    { hex: '#FFA500', gradient: ['#FFA500', '#EE9400'], textColor: '#fff', borderColor: '#FFA500' },
    { hex: '#FF8C00', gradient: ['#FF8C00', '#EE7B00'], textColor: '#fff', borderColor: '#FF8C00' },
    { hex: '#FF0000', gradient: ['#FF0000', '#EE0000'], textColor: '#fff', borderColor: '#FF0000' },
    { hex: '#B22222', gradient: ['#B22222', '#A11111'], textColor: '#fff', borderColor: '#B22222' },
    { hex: '#8A2BE2', gradient: ['#8A2BE2', '#791AD1'], textColor: '#fff', borderColor: '#8A2BE2' },
    { hex: '#800080', gradient: ['#800080', '#6F006F'], textColor: '#fff', borderColor: '#800080' },
    { hex: '#800000', gradient: ['#800000', '#6F0000'], textColor: '#fff', borderColor: '#800000' },
    { hex: '#A52A2A', gradient: ['#A52A2A', '#941919'], textColor: '#fff', borderColor: '#A52A2A' },
    { hex: '#4B0000', gradient: ['#4B0000', '#3A0000'], textColor: '#fff', borderColor: '#4B0000' },
    { hex: '#2F1B1B', gradient: ['#2F1B1B', '#1E0A0A'], textColor: '#fff', borderColor: '#2F1B1B' },
    { hex: '#1C1C1C', gradient: ['#1C1C1C', '#0B0B0B'], textColor: '#fff', borderColor: '#1C1C1C' },
    { hex: '#000000', gradient: ['#000000', '#000000'], textColor: '#fff', borderColor: '#FF0000' },
  ],
  'SO2': [
    { hex: '#00E400', gradient: ['#00E400', '#00C400'], textColor: '#000', borderColor: '#00E400' },
    { hex: '#7CFC00', gradient: ['#7CFC00', '#6BDB00'], textColor: '#000', borderColor: '#7CFC00' },
    { hex: '#ADFF2F', gradient: ['#ADFF2F', '#9CEE1E'], textColor: '#000', borderColor: '#ADFF2F' },
    { hex: '#FFFF00', gradient: ['#FFFF00', '#EEEE00'], textColor: '#000', borderColor: '#FFFF00' },
    { hex: '#FFA500', gradient: ['#FFA500', '#EE9400'], textColor: '#fff', borderColor: '#FFA500' },
    { hex: '#FF8C00', gradient: ['#FF8C00', '#EE7B00'], textColor: '#fff', borderColor: '#FF8C00' },
    { hex: '#FF0000', gradient: ['#FF0000', '#EE0000'], textColor: '#fff', borderColor: '#FF0000' },
    { hex: '#B22222', gradient: ['#B22222', '#A11111'], textColor: '#fff', borderColor: '#B22222' },
    { hex: '#8A2BE2', gradient: ['#8A2BE2', '#791AD1'], textColor: '#fff', borderColor: '#8A2BE2' },
    { hex: '#800080', gradient: ['#800080', '#6F006F'], textColor: '#fff', borderColor: '#800080' },
    { hex: '#800000', gradient: ['#800000', '#6F0000'], textColor: '#fff', borderColor: '#800000' },
    { hex: '#A52A2A', gradient: ['#A52A2A', '#941919'], textColor: '#fff', borderColor: '#A52A2A' },
    { hex: '#4B0000', gradient: ['#4B0000', '#3A0000'], textColor: '#fff', borderColor: '#4B0000' },
    { hex: '#2F1B1B', gradient: ['#2F1B1B', '#1E0A0A'], textColor: '#fff', borderColor: '#2F1B1B' },
    { hex: '#1C1C1C', gradient: ['#1C1C1C', '#0B0B0B'], textColor: '#fff', borderColor: '#1C1C1C' },
    { hex: '#000000', gradient: ['#000000', '#000000'], textColor: '#fff', borderColor: '#FF0000' },
  ],
};

// Helper to get color info for a pollutant value
export function getPollutantColorInfo(name: string, value: number): PollutantColorInfo {
  const scale = POLLUTANT_COLORS[name] || POLLUTANT_COLORS['PM2.5'];
  
  // Pollutant-specific breakpoints based on WHO standards and health impact
  const breakpoints: Record<string, number[]> = {
    'PM2.5': [12, 25, 35, 55, 75, 100, 125, 150, 200, 250, 300, 350, 400, 500, 600], // μg/m³
    'PM10': [20, 40, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000], // μg/m³
    'NO2': [40, 60, 100, 150, 200, 250, 300, 350, 400, 500, 600, 700, 800, 900, 1000], // μg/m³
    'CO': [4, 6, 9, 12, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100], // mg/m³
    'O3': [100, 120, 160, 200, 240, 280, 320, 360, 400, 450, 500, 550, 600, 650, 700], // μg/m³
    'SO2': [20, 40, 125, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000], // μg/m³
  };
  
  const pollutantBreakpoints = breakpoints[name] || breakpoints['PM2.5'];
  
  for (let i = 0; i < pollutantBreakpoints.length; i++) {
    if (value <= pollutantBreakpoints[i]) return scale[i];
  }
  return scale[scale.length - 1];
} 