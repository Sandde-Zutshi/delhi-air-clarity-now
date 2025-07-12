import { useState, useEffect, useCallback } from 'react';
import { getAQIByCity, getAQIByCoordinates, getCurrentLocation, AirQualityData } from '@/lib/waqi-api';
import RequestManager from '@/lib/request-manager';

interface UseAQIProps {
  initialLocation?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export function useAQI({ 
  initialLocation = 'Delhi', 
  autoRefresh = true, 
  refreshInterval 
}: UseAQIProps = {}) {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState(initialLocation);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [requestStats, setRequestStats] = useState(RequestManager.getInstance().getStats());

  const requestManager = RequestManager.getInstance();

  const fetchAQI = useCallback(async (cityOrCoords: string | { lat: number; lon: number }, isManualRefresh: boolean = false) => {
    // Check if we can make the request
    if (!requestManager.canMakeRequest(isManualRefresh)) {
      if (isManualRefresh) {
        setError('Manual refresh limit reached for today. Please try again tomorrow.');
      } else {
        setError('Daily API request limit reached. Please try again tomorrow.');
      }
      return;
    }

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
      
      // Record the successful request
      requestManager.recordRequest(isManualRefresh);
      setRequestStats(requestManager.getStats());
      
      setData(aqiData);
      setLastFetch(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AQI data');
      console.error('AQI fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [requestManager]);

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
      fetchAQI(data.location, true); // Mark as manual refresh
    }
  }, [data, fetchAQI]);

  // Get dynamic refresh interval based on time of day
  const getDynamicInterval = useCallback(() => {
    return requestManager.getRequestInterval();
  }, [requestManager]);

  // Initial fetch
  useEffect(() => {
    fetchAQI(initialLocation);
  }, [initialLocation, fetchAQI]);

  // Auto-refresh with dynamic intervals
  useEffect(() => {
    if (!autoRefresh || !data) return;

    const interval = setInterval(() => {
      refresh();
    }, refreshInterval || getDynamicInterval());

    return () => clearInterval(interval);
  }, [autoRefresh, data, refresh, refreshInterval, getDynamicInterval]);

  // Update stats periodically
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setRequestStats(requestManager.getStats());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(statsInterval);
  }, [requestManager]);

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
    requestStats,
    canManualRefresh: requestManager.isManualRefreshAllowed(),
    remainingRequests: requestManager.getRemainingRequests(),
    remainingManualRefreshes: requestManager.getRemainingManualRefreshes(),
    timeUntilReset: requestManager.getTimeUntilReset(),
  };
} 