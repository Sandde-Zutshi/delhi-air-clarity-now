// Delhi Station-level Air Quality APIs
// WAQI/AQICN API and OpenAQ API integration

// WAQI/AQICN API - Station-level data for Delhi
const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN || 'demo'; // You'll need to get a token from https://aqicn.org/data-platform/token/
const WAQI_BASE_URL = 'https://api.waqi.info/feed';

// OpenAQ API - Real-time Delhi data
const OPENAQ_BASE_URL = 'https://api.openaq.org/v2';

export interface StationData {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  aqi: number;
  aqiLevel: string;
  pollutants: {
    pm2_5?: number;
    pm10?: number;
    no2?: number;
    co?: number;
    o3?: number;
    so2?: number;
  };
  lastUpdated: Date;
  source: 'WAQI' | 'OpenAQ';
  stationType: 'government' | 'research' | 'community';
}

export interface DelhiStationsData {
  stations: StationData[];
  lastUpdated: Date;
  totalStations: number;
  averageAQI: number;
}

// Key Delhi monitoring stations
const DELHI_STATIONS = [
  { name: "ITO", location: "ITO, Delhi", lat: 28.6139, lon: 77.2090, type: "government" },
  { name: "Anand Vihar", location: "Anand Vihar, Delhi", lat: 28.6504, lon: 77.3153, type: "government" },
  { name: "Jahangirpuri", location: "Jahangirpuri, Delhi", lat: 28.7328, lon: 77.0897, type: "government" },
  { name: "R.K. Puram", location: "R.K. Puram, Delhi", lat: 28.5642, lon: 77.2025, type: "government" },
  { name: "Dwarka", location: "Dwarka, Delhi", lat: 28.5682, lon: 77.0645, type: "government" },
  { name: "Connaught Place", location: "Connaught Place, Delhi", lat: 28.6315, lon: 77.2167, type: "government" },
  { name: "India Gate", location: "India Gate, Delhi", lat: 28.6129, lon: 77.2295, type: "government" },
  { name: "Lajpat Nagar", location: "Lajpat Nagar, Delhi", lat: 28.5675, lon: 77.2431, type: "government" },
  { name: "Karol Bagh", location: "Karol Bagh, Delhi", lat: 28.6517, lon: 77.2219, type: "government" },
  { name: "Pitampura", location: "Pitampura, Delhi", lat: 28.6980, lon: 77.1215, type: "government" },
  { name: "Rohini", location: "Rohini, Delhi", lat: 28.7438, lon: 77.0728, type: "government" },
  { name: "Mundka", location: "Mundka, Delhi", lat: 28.6833, lon: 77.0333, type: "government" },
  { name: "Wazirpur", location: "Wazirpur, Delhi", lat: 28.7167, lon: 77.1333, type: "government" },
  { name: "Bawana", location: "Bawana, Delhi", lat: 28.8000, lon: 77.0333, type: "government" },
  { name: "Najafgarh", location: "Najafgarh, Delhi", lat: 28.6103, lon: 76.9795, type: "government" }
];

// Get AQI level from value
const getAQILevel = (aqi: number): string => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

// Fetch data from WAQI/AQICN API
async function fetchWAQIData(station: any): Promise<StationData | null> {
  try {
    const response = await fetch(`${WAQI_BASE_URL}/@${station.lat};${station.lon}/?token=${WAQI_TOKEN}`);
    
    if (!response.ok) {
      console.warn(`WAQI API failed for ${station.name}:`, response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok' || !data.data) {
      console.warn(`WAQI API returned error for ${station.name}:`, data);
      return null;
    }
    
    const aqi = data.data.aqi;
    const iaqi = data.data.iaqi || {};
    
    return {
      id: `waqi-${station.name}`,
      name: station.name,
      location: station.location,
      coordinates: { lat: station.lat, lon: station.lon },
      aqi: aqi,
      aqiLevel: getAQILevel(aqi),
      pollutants: {
        pm2_5: iaqi.pm25?.v,
        pm10: iaqi.pm10?.v,
        no2: iaqi.no2?.v,
        co: iaqi.co?.v,
        o3: iaqi.o3?.v,
        so2: iaqi.so2?.v,
      },
      lastUpdated: new Date(data.data.time.v * 1000),
      source: 'WAQI',
      stationType: station.type as 'government' | 'research' | 'community'
    };
  } catch (error) {
    console.error(`Error fetching WAQI data for ${station.name}:`, error);
    return null;
  }
}

// Fetch data from OpenAQ API
async function fetchOpenAQData(station: any): Promise<StationData | null> {
  try {
    // OpenAQ API for Delhi area
    const response = await fetch(
      `${OPENAQ_BASE_URL}/measurements?location=${encodeURIComponent(station.location)}&limit=100&order_by=datetime&sort=desc`
    );
    
    if (!response.ok) {
      console.warn(`OpenAQ API failed for ${station.name}:`, response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.warn(`No OpenAQ data for ${station.name}`);
      return null;
    }
    
    // Group measurements by parameter
    const measurements = data.results.reduce((acc: any, measurement: any) => {
      acc[measurement.parameter] = measurement.value;
      return acc;
    }, {});
    
    // Calculate AQI from PM2.5 (simplified calculation)
    const pm25 = measurements.pm25;
    let aqi = 0;
    if (pm25) {
      if (pm25 <= 12) aqi = Math.round((pm25 / 12) * 50);
      else if (pm25 <= 35.4) aqi = Math.round(51 + ((pm25 - 12) / (35.4 - 12)) * 49);
      else if (pm25 <= 55.4) aqi = Math.round(101 + ((pm25 - 35.4) / (55.4 - 35.4)) * 49);
      else if (pm25 <= 150.4) aqi = Math.round(151 + ((pm25 - 55.4) / (150.4 - 55.4)) * 49);
      else if (pm25 <= 250.4) aqi = Math.round(201 + ((pm25 - 150.4) / (250.4 - 150.4)) * 99);
      else aqi = Math.round(301 + ((pm25 - 250.4) / (500 - 250.4)) * 199);
    }
    
    return {
      id: `openaq-${station.name}`,
      name: station.name,
      location: station.location,
      coordinates: { lat: station.lat, lon: station.lon },
      aqi: aqi,
      aqiLevel: getAQILevel(aqi),
      pollutants: {
        pm2_5: measurements.pm25,
        pm10: measurements.pm10,
        no2: measurements.no2,
        co: measurements.co,
        o3: measurements.o3,
        so2: measurements.so2,
      },
      lastUpdated: new Date(data.results[0]?.datetime || Date.now()),
      source: 'OpenAQ',
      stationType: station.type as 'government' | 'research' | 'community'
    };
  } catch (error) {
    console.error(`Error fetching OpenAQ data for ${station.name}:`, error);
    return null;
  }
}

// Get all Delhi station data
export async function getDelhiStationsData(): Promise<DelhiStationsData> {
  try {
    console.log('Fetching Delhi station data from WAQI and OpenAQ...');
    
    // Fetch from both APIs in parallel
    const waqiPromises = DELHI_STATIONS.map(station => fetchWAQIData(station));
    const openaqPromises = DELHI_STATIONS.map(station => fetchOpenAQData(station));
    
    const [waqiResults, openaqResults] = await Promise.all([
      Promise.all(waqiPromises),
      Promise.all(openaqPromises)
    ]);
    
    // Combine and deduplicate results (prefer WAQI if both have data)
    const stationMap = new Map<string, StationData>();
    
    // Add WAQI results
    waqiResults.forEach(result => {
      if (result) {
        stationMap.set(result.name, result);
      }
    });
    
    // Add OpenAQ results (only if WAQI doesn't have data for that station)
    openaqResults.forEach(result => {
      if (result && !stationMap.has(result.name)) {
        stationMap.set(result.name, result);
      }
    });
    
    const stations = Array.from(stationMap.values());
    
    // Calculate average AQI
    const validAQIs = stations.filter(s => s.aqi > 0).map(s => s.aqi);
    const averageAQI = validAQIs.length > 0 
      ? Math.round(validAQIs.reduce((sum, aqi) => sum + aqi, 0) / validAQIs.length)
      : 0;
    
    return {
      stations,
      lastUpdated: new Date(),
      totalStations: stations.length,
      averageAQI
    };
  } catch (error) {
    console.error('Error fetching Delhi stations data:', error);
    throw error;
  }
}

// Get specific station data
export async function getStationData(stationName: string): Promise<StationData | null> {
  try {
    const station = DELHI_STATIONS.find(s => s.name === stationName);
    if (!station) {
      throw new Error(`Station ${stationName} not found`);
    }
    
    // Try WAQI first, then OpenAQ
    const waqiData = await fetchWAQIData(station);
    if (waqiData) return waqiData;
    
    const openaqData = await fetchOpenAQData(station);
    return openaqData;
  } catch (error) {
    console.error(`Error fetching station data for ${stationName}:`, error);
    return null;
  }
}

// Get stations by AQI level
export async function getStationsByAQILevel(level: string): Promise<StationData[]> {
  try {
    const data = await getDelhiStationsData();
    return data.stations.filter(station => station.aqiLevel === level);
  } catch (error) {
    console.error('Error fetching stations by AQI level:', error);
    return [];
  }
}

// Get worst affected stations (top 5 by AQI)
export async function getWorstAffectedStations(): Promise<StationData[]> {
  try {
    const data = await getDelhiStationsData();
    return data.stations
      .filter(station => station.aqi > 0)
      .sort((a, b) => b.aqi - a.aqi)
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching worst affected stations:', error);
    return [];
  }
} 