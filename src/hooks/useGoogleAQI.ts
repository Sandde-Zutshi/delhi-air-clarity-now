import { useEffect, useState } from 'react';

interface GoogleAQIData {
  aqi?: number;
  pm25?: number;
  pm10?: number;
  no2?: number;
  co?: number;
  o3?: number;
  so2?: number;
  timestamp: number;
}

interface UseGoogleAQIResult {
  data: GoogleAQIData | null;
  loading: boolean;
  error: string | null;
}

// Use environment variable for API key
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_AQI_API_KEY;

// Debug: Check if API key is loaded
console.log('Google API Key loaded:', GOOGLE_API_KEY ? 'Yes' : 'No');
console.log('API Key length:', GOOGLE_API_KEY?.length || 0);

// Fallback for development (remove in production)
const FALLBACK_API_KEY = 'AIzaSyBgQNG7b6h5UfoCAcb3NwfLwmy01VmcV2A';
const API_KEY_TO_USE = GOOGLE_API_KEY || FALLBACK_API_KEY;

export function useGoogleAQI(
  latitude: number = 28.7041, // Default to Delhi coordinates
  longitude: number = 77.1025
): UseGoogleAQIResult {
  const [data, setData] = useState<GoogleAQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!API_KEY_TO_USE) {
      setError('Google AQI API key not configured. Please check your .env.local file.');
      setLoading(false);
      return;
    }

    // Additional validation
    if (API_KEY_TO_USE.length < 10) {
      setError('Google AQI API key appears to be invalid (too short)');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchGoogleAQI = async () => {
      try {
        // Try multiple possible Google AQI API endpoints
        const endpoints = [
          `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${API_KEY_TO_USE}&languageCode=en`,
          `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${API_KEY_TO_USE}`,
          `https://airquality.googleapis.com/v1/currentConditions?key=${API_KEY_TO_USE}&location.latitude=${latitude}&location.longitude=${longitude}`
        ];

        let result;
        let lastError;

        for (const endpoint of endpoints) {
          try {
            console.log('Trying endpoint:', endpoint);
            
            const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                location: {
                  latitude,
                  longitude,
                },
                extraComputations: ['HEALTH_RECOMMENDATIONS'],
              }),
            });

            if (!response.ok) {
              console.error('API Response Status:', response.status);
              console.error('API Response Status Text:', response.statusText);
              throw new Error(`Google AQI API error: ${response.status} ${response.statusText}`);
            }

            result = await response.json();
            console.log('Success with endpoint:', endpoint);
            break; // Success, exit the loop
          } catch (error) {
            console.log('Failed with endpoint:', endpoint, error);
            lastError = error;
            continue; // Try next endpoint
          }
        }

        if (!result) {
          throw lastError || new Error('All Google AQI API endpoints failed');
        }

        // Debug: Log the full API response
        console.log('Google AQI API Response:', result);

        if (result.error) {
          throw new Error(`Google AQI API error: ${result.error.message}`);
        }

        // Extract and normalize data from Google's response
        const currentConditions = result.currentConditions;
        console.log('Current Conditions:', currentConditions);
        console.log('Response keys:', Object.keys(result));
        
        // Try different possible response structures
        let airQualityData = currentConditions;
        
        if (!airQualityData && result.data) {
          airQualityData = result.data;
          console.log('Using result.data instead of currentConditions');
        }
        
        if (!airQualityData && result.airQuality) {
          airQualityData = result.airQuality;
          console.log('Using result.airQuality instead of currentConditions');
        }
        
        if (!airQualityData) {
          console.log('No currentConditions found in response');
          console.log('Available keys in result:', Object.keys(result));
          throw new Error(`No air quality data available. Response structure: ${JSON.stringify(Object.keys(result))}`);
        }

        // Debug: Log the structure of currentConditions
        console.log('Air Quality Data structure:', airQualityData);
        console.log('Air Quality Data keys:', Object.keys(airQualityData));

        const normalizedData: GoogleAQIData = {
          aqi: airQualityData.aqi || airQualityData.index || undefined,
          pm25: airQualityData.pm25?.concentration || airQualityData.pm25 || airQualityData.pm2_5 || undefined,
          pm10: airQualityData.pm10?.concentration || airQualityData.pm10 || undefined,
          no2: airQualityData.no2?.concentration || airQualityData.no2 || undefined,
          co: airQualityData.co?.concentration || airQualityData.co || undefined,
          o3: airQualityData.o3?.concentration || airQualityData.o3 || undefined,
          so2: airQualityData.so2?.concentration || airQualityData.so2 || undefined,
          timestamp: Date.now(),
        };

        console.log('Normalized data:', normalizedData);
        setData(normalizedData);
      } catch (err) {
        console.error('Google AQI fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch Google AQI data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleAQI();
  }, [latitude, longitude]);

  return { data, loading, error };
} 