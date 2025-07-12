// WAQI/AQICN API Integration for Delhi Air Quality
// Primary data source for government-grade air quality monitoring

const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN || 'demo';
const WAQI_BASE_URL = 'https://api.waqi.info/feed';

// Debug logging
console.log('WAQI Token loaded:', WAQI_TOKEN ? 'Yes' : 'No');
console.log('WAQI Token value:', WAQI_TOKEN.substring(0, 10) + '...');

export interface AirQualityData {
  aqi: number;
  location: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  pollutants: {
    pm2_5: number;
    pm10: number;
    no2: number;
    co: number;
    o3: number;
    so2: number;
  };
  lastUpdated: Date;
  source: 'WAQI' | 'Demo';
  aqiLevel: string;
  healthImplications: string;
  cautionStatement: string;
}

export interface LocationData {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

// Delhi coordinates (center of Delhi)
const DELHI_COORDINATES = {
  lat: 28.7041,
  lon: 77.1025
};

// Get AQI level and health implications
const getAQIInfo = (aqi: number) => {
  if (aqi <= 50) {
    return {
      level: "Good",
      healthImplications: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
      cautionStatement: "None"
    };
  } else if (aqi <= 100) {
    return {
      level: "Moderate",
      healthImplications: "Air quality is acceptable; however, some pollutants may be a concern for a small number of people who are unusually sensitive to air pollution.",
      cautionStatement: "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion."
    };
  } else if (aqi <= 150) {
    return {
      level: "Unhealthy for Sensitive Groups",
      healthImplications: "Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
      cautionStatement: "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion."
    };
  } else if (aqi <= 200) {
    return {
      level: "Unhealthy",
      healthImplications: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
      cautionStatement: "Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion."
    };
  } else if (aqi <= 300) {
    return {
      level: "Very Unhealthy",
      healthImplications: "Health warnings of emergency conditions. The entire population is more likely to be affected.",
      cautionStatement: "Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion."
    };
  } else {
    return {
      level: "Hazardous",
      healthImplications: "Health alert: everyone may experience more serious health effects.",
      cautionStatement: "Everyone should avoid all outdoor exertion."
    };
  }
};

// Generate demo data for fallback
const generateDemoData = (): AirQualityData => {
  // Use consistent Delhi AQI value for demo (Very Unhealthy - typical for Delhi)
  const demoAQI = 275; // Consistent AQI value in Very Unhealthy range (201-300)
  const aqiInfo = getAQIInfo(demoAQI);
  
  return {
    aqi: demoAQI,
    location: 'Delhi, India (Demo)',
    coordinates: DELHI_COORDINATES,
    pollutants: {
      pm2_5: 120, // High PM2.5 level (μg/m³)
      pm10: 180, // High PM10 level (μg/m³)
      no2: 55, // High NO2 level (ppb)
      co: 3.5, // Moderate CO level (ppm)
      o3: 75, // High O3 level (ppb)
      so2: 25, // Moderate SO2 level (ppb)
    },
    lastUpdated: new Date(),
    source: 'Demo',
    aqiLevel: aqiInfo.level,
    healthImplications: aqiInfo.healthImplications,
    cautionStatement: aqiInfo.cautionStatement
  };
};

// Get AQI data for Delhi with fallback
export async function getDelhiAQI(): Promise<AirQualityData> {
  try {
    console.log('Fetching Delhi AQI data from WAQI/AQICN...');
    console.log('Using token:', WAQI_TOKEN.substring(0, 10) + '...');
    
    const url = `${WAQI_BASE_URL}/@${DELHI_COORDINATES.lat};${DELHI_COORDINATES.lon}/?token=${WAQI_TOKEN}`;
    console.log('Requesting URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      console.error('WAQI API failed:', response.status, response.statusText);
      throw new Error(`WAQI API failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('WAQI API response:', data);
    
    if (data.status !== 'ok' || !data.data) {
      console.error('WAQI API returned error status:', data.status);
      console.error('WAQI API error message:', data.data?.message || 'No error message');
      throw new Error(`WAQI API returned error: ${data.status} - ${data.data?.message || 'Unknown error'}`);
    }
    
    const aqi = data.data.aqi;
    const iaqi = data.data.iaqi || {};
    const aqiInfo = getAQIInfo(aqi);
    
    return {
      aqi: aqi,
      location: data.data.city?.name || 'Delhi, India',
      coordinates: {
        lat: data.data.city?.geo?.[0] || DELHI_COORDINATES.lat,
        lon: data.data.city?.geo?.[1] || DELHI_COORDINATES.lon
      },
      pollutants: {
        pm2_5: iaqi.pm25?.v || 0,
        pm10: iaqi.pm10?.v || 0,
        no2: iaqi.no2?.v || 0,
        co: iaqi.co?.v || 0,
        o3: iaqi.o3?.v || 0,
        so2: iaqi.so2?.v || 0,
      },
      lastUpdated: new Date(data.data.time.v * 1000),
      source: 'WAQI',
      aqiLevel: aqiInfo.level,
      healthImplications: aqiInfo.healthImplications,
      cautionStatement: aqiInfo.cautionStatement
    };
  } catch (error) {
    console.error('Error fetching WAQI data:', error);
    console.log('Falling back to demo data...');
    
    // Return demo data as fallback
    return generateDemoData();
  }
}

// Get AQI data by city name (fallback to coordinates)
export async function getAQIByCity(city: string): Promise<AirQualityData> {
  try {
    console.log(`Fetching AQI data for ${city} from WAQI/AQICN...`);
    
    // For Delhi, use the specific Delhi endpoint
    if (city.toLowerCase().includes('delhi')) {
      return await getDelhiAQI();
    }
    
    // For other cities, try to get coordinates first
    const response = await fetch(
      `${WAQI_BASE_URL}/${encodeURIComponent(city)}/?token=${WAQI_TOKEN}`
    );
    
    if (!response.ok) {
      throw new Error(`City not found: ${city}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok' || !data.data) {
      throw new Error(`WAQI API returned error for ${city}: ${data.status}`);
    }
    
    const aqi = data.data.aqi;
    const iaqi = data.data.iaqi || {};
    const aqiInfo = getAQIInfo(aqi);
    
    return {
      aqi: aqi,
      location: data.data.city?.name || city,
      coordinates: {
        lat: data.data.city?.geo?.[0] || 0,
        lon: data.data.city?.geo?.[1] || 0
      },
      pollutants: {
        pm2_5: iaqi.pm25?.v || 0,
        pm10: iaqi.pm10?.v || 0,
        no2: iaqi.no2?.v || 0,
        co: iaqi.co?.v || 0,
        o3: iaqi.o3?.v || 0,
        so2: iaqi.so2?.v || 0,
      },
      lastUpdated: new Date(data.data.time.v * 1000),
      source: 'WAQI',
      aqiLevel: aqiInfo.level,
      healthImplications: aqiInfo.healthImplications,
      cautionStatement: aqiInfo.cautionStatement
    };
  } catch (error) {
    console.error(`Error fetching AQI data for ${city}:`, error);
    
    // For Delhi, return demo data as fallback
    if (city.toLowerCase().includes('delhi')) {
      console.log('Returning demo data for Delhi...');
      return generateDemoData();
    }
    
    throw error;
  }
}

// Get AQI data by coordinates
export async function getAQIByCoordinates(lat: number, lon: number): Promise<AirQualityData> {
  try {
    console.log(`Fetching AQI data for coordinates (${lat}, ${lon}) from WAQI/AQICN...`);
    
    const response = await fetch(
      `${WAQI_BASE_URL}/@${lat};${lon}/?token=${WAQI_TOKEN}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch air quality data for coordinates');
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok' || !data.data) {
      throw new Error(`WAQI API returned error for coordinates: ${data.status}`);
    }
    
    const aqi = data.data.aqi;
    const iaqi = data.data.iaqi || {};
    const aqiInfo = getAQIInfo(aqi);
    
    return {
      aqi: aqi,
      location: data.data.city?.name || 'Unknown Location',
      coordinates: { lat, lon },
      pollutants: {
        pm2_5: iaqi.pm25?.v || 0,
        pm10: iaqi.pm10?.v || 0,
        no2: iaqi.no2?.v || 0,
        co: iaqi.co?.v || 0,
        o3: iaqi.o3?.v || 0,
        so2: iaqi.so2?.v || 0,
      },
      lastUpdated: new Date(data.data.time.v * 1000),
      source: 'WAQI',
      aqiLevel: aqiInfo.level,
      healthImplications: aqiInfo.healthImplications,
      cautionStatement: aqiInfo.cautionStatement
    };
  } catch (error) {
    console.error('Error fetching AQI data for coordinates:', error);
    throw error;
  }
}

// Search for cities by name
export async function searchCities(query: string): Promise<LocationData[]> {
  try {
    const response = await fetch(
      `${WAQI_BASE_URL}/search/?keyword=${encodeURIComponent(query)}&token=${WAQI_TOKEN}`
    );
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok' || !data.data) {
      return [];
    }
    
    return data.data.map((city: any) => ({
      name: city.station?.name || city.city?.name || 'Unknown',
      country: city.city?.country || 'Unknown',
      state: city.city?.state,
      lat: city.city?.geo?.[0] || 0,
      lon: city.city?.geo?.[1] || 0,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

// Get user's current location (same as before)
export function getCurrentLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
} 