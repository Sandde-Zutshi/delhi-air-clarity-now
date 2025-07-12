const API_KEY = '240c5c884f025c319458fd7f46720534';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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
}

export interface LocationData {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

// Get AQI data by city name
export async function getAQIByCity(city: string): Promise<AirQualityData> {
  try {
    // First get coordinates for the city
    const geoResponse = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`
    );
    
    if (!geoResponse.ok) {
      throw new Error(`City not found: ${city}`);
    }
    
    const geoData = await geoResponse.json();
    const { lat, lon } = geoData.coord;
    
    // Then get air pollution data
    const aqiResponse = await fetch(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (!aqiResponse.ok) {
      throw new Error('Failed to fetch air quality data');
    }
    
    const aqiData = await aqiResponse.json();
    
    return {
      aqi: aqiData.list[0].main.aqi,
      location: geoData.name,
      coordinates: { lat, lon },
      pollutants: {
        pm2_5: aqiData.list[0].components.pm2_5,
        pm10: aqiData.list[0].components.pm10,
        no2: aqiData.list[0].components.no2,
        co: aqiData.list[0].components.co,
        o3: aqiData.list[0].components.o3,
        so2: aqiData.list[0].components.so2,
      },
      lastUpdated: new Date(aqiData.list[0].dt * 1000),
    };
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    throw error;
  }
}

// Get AQI data by coordinates
export async function getAQIByCoordinates(lat: number, lon: number): Promise<AirQualityData> {
  try {
    // Get air pollution data
    const aqiResponse = await fetch(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (!aqiResponse.ok) {
      throw new Error('Failed to fetch air quality data');
    }
    
    const aqiData = await aqiResponse.json();
    
    // Get location name from coordinates
    const geoResponse = await fetch(
      `${BASE_URL}/reverse?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    let locationName = 'Unknown Location';
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      locationName = geoData[0]?.name || 'Unknown Location';
    }
    
    return {
      aqi: aqiData.list[0].main.aqi,
      location: locationName,
      coordinates: { lat, lon },
      pollutants: {
        pm2_5: aqiData.list[0].components.pm2_5,
        pm10: aqiData.list[0].components.pm10,
        no2: aqiData.list[0].components.no2,
        co: aqiData.list[0].components.co,
        o3: aqiData.list[0].components.o3,
        so2: aqiData.list[0].components.so2,
      },
      lastUpdated: new Date(aqiData.list[0].dt * 1000),
    };
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    throw error;
  }
}

// Search for cities by name
export async function searchCities(query: string): Promise<LocationData[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    return [{
      name: data.name,
      country: data.sys.country,
      state: data.sys.state,
      lat: data.coord.lat,
      lon: data.coord.lon,
    }];
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

// Get user's current location
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