import { useState, useEffect, useCallback } from 'react';
import { getAQIByCity, getAQIByCoordinates, getCurrentLocation, AirQualityData } from '@/lib/api';

interface UseAQIProps {
  initialLocation?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export function useAQI({ 
  initialLocation = 'Delhi', 
  autoRefresh = true, 
  refreshInterval = 300000 // 5 minutes
}: UseAQIProps = {}) {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState(initialLocation);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchAQI = useCallback(async (cityOrCoords: string | { lat: number; lon: number }) => {
    setLoading(true);
    setError(null);
    
    try {
      let aqiData: AirQualityData;
      
      if (typeof cityOrCoords === 'string') {
        aqiData = await getAQIByCity(cityOrCoords);
        setLocation(aqiData.location);
      } else {
        aqiData = await getAQIByCoordinates(cityOrCoords.lat, cityOrCoords.lon);
        setLocation(aqiData.location);
      }
      
      setData(aqiData);
      setLastFetch(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AQI data');
      console.error('AQI fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCity = useCallback((city: string) => {
    fetchAQI(city);
  }, [fetchAQI]);

  const fetchByCoordinates = useCallback((lat: number, lon: number) => {
    fetchAQI({ lat, lon });
  }, [fetchAQI]);

  const fetchCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const coords = await getCurrentLocation();
      await fetchAQI(coords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current location');
      console.error('Geolocation error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchAQI]);

  const refresh = useCallback(() => {
    if (data) {
      fetchAQI(data.location);
    }
  }, [data, fetchAQI]);

  // Initial fetch
  useEffect(() => {
    fetchAQI(initialLocation);
  }, [initialLocation, fetchAQI]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !data) return;

    const interval = setInterval(() => {
      refresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, data, refresh, refreshInterval]);

  return {
    data,
    loading,
    error,
    location,
    lastFetch,
    fetchByCity,
    fetchByCoordinates,
    fetchCurrentLocation,
    refresh,
  };
} 