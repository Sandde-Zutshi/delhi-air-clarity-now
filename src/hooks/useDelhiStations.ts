import { useState, useEffect, useCallback } from 'react';
import { getDelhiStationsData, getStationData, getWorstAffectedStations, getStationsByAQILevel, StationData, DelhiStationsData } from '@/lib/delhi-station-api';

interface UseDelhiStationsReturn {
  // Main data
  stationsData: DelhiStationsData | null;
  loading: boolean;
  error: string | null;
  
  // Individual station data
  selectedStation: StationData | null;
  worstAffectedStations: StationData[];
  stationsByLevel: { [key: string]: StationData[] };
  
  // Actions
  refreshData: () => Promise<void>;
  selectStation: (stationName: string) => Promise<void>;
  getStationsByLevel: (level: string) => Promise<StationData[]>;
  
  // Computed values
  averageAQI: number;
  totalStations: number;
  lastUpdated: Date | null;
}

export function useDelhiStations(): UseDelhiStationsReturn {
  const [stationsData, setStationsData] = useState<DelhiStationsData | null>(null);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [worstAffectedStations, setWorstAffectedStations] = useState<StationData[]>([]);
  const [stationsByLevel, setStationsByLevel] = useState<{ [key: string]: StationData[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all Delhi stations data
  const fetchStationsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching Delhi stations data...');
      const data = await getDelhiStationsData();
      setStationsData(data);
      
      // Get worst affected stations
      const worstStations = await getWorstAffectedStations();
      setWorstAffectedStations(worstStations);
      
      // Group stations by AQI level
      const levelGroups: { [key: string]: StationData[] } = {};
      data.stations.forEach(station => {
        if (!levelGroups[station.aqiLevel]) {
          levelGroups[station.aqiLevel] = [];
        }
        levelGroups[station.aqiLevel].push(station);
      });
      setStationsByLevel(levelGroups);
      
      console.log(`Loaded ${data.stations.length} Delhi stations with average AQI: ${data.averageAQI}`);
    } catch (err) {
      console.error('Error fetching Delhi stations data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch station data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Select a specific station
  const selectStation = useCallback(async (stationName: string) => {
    try {
      setLoading(true);
      const station = await getStationData(stationName);
      setSelectedStation(station);
    } catch (err) {
      console.error(`Error selecting station ${stationName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to select station');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get stations by AQI level
  const getStationsByLevel = useCallback(async (level: string): Promise<StationData[]> => {
    try {
      return await getStationsByAQILevel(level);
    } catch (err) {
      console.error(`Error getting stations by level ${level}:`, err);
      return [];
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    await fetchStationsData();
  }, [fetchStationsData]);

  // Initial data fetch
  useEffect(() => {
    fetchStationsData();
  }, [fetchStationsData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing Delhi stations data...');
      fetchStationsData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchStationsData]);

  return {
    // Main data
    stationsData,
    loading,
    error,
    
    // Individual station data
    selectedStation,
    worstAffectedStations,
    stationsByLevel,
    
    // Actions
    refreshData,
    selectStation,
    getStationsByLevel,
    
    // Computed values
    averageAQI: stationsData?.averageAQI || 0,
    totalStations: stationsData?.totalStations || 0,
    lastUpdated: stationsData?.lastUpdated || null,
  };
} 