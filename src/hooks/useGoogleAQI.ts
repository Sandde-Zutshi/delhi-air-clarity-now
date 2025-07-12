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

export function useGoogleAQI(
  latitude: number = 28.7041, // Default to Delhi coordinates
  longitude: number = 77.1025
): UseGoogleAQIResult {
  const [data, setData] = useState<GoogleAQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!GOOGLE_API_KEY) {
      setError('Google AQI API key not configured');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchGoogleAQI = async () => {
      try {
        // Use Google's Air Quality API endpoint
        const response = await fetch(
          `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${GOOGLE_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              location: {
                latitude,
                longitude,
              },
              extraComputations: ['HEALTH_RECOMMENDATIONS', 'DOMINANT_POLLUTANT_CONCENTRATION'],
              languageCode: 'en',
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Google AQI API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.error) {
          throw new Error(`Google AQI API error: ${result.error.message}`);
        }

        // Extract and normalize data from Google's response
        const currentConditions = result.currentConditions;
        if (!currentConditions) {
          throw new Error('No current conditions data available');
        }

        const normalizedData: GoogleAQIData = {
          aqi: currentConditions.aqi || undefined,
          pm25: currentConditions.pm25?.concentration || undefined,
          pm10: currentConditions.pm10?.concentration || undefined,
          no2: currentConditions.no2?.concentration || undefined,
          co: currentConditions.co?.concentration || undefined,
          o3: currentConditions.o3?.concentration || undefined,
          so2: currentConditions.so2?.concentration || undefined,
          timestamp: Date.now(),
        };

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