import { useEffect, useState } from 'react';

interface PollutantData {
  value: number;
  unit: string;
  timestamp: number;
}

interface CPCBAirQuality {
  pm?: PollutantData;
  so2?: PollutantData;
  bod?: PollutantData;
  cod?: PollutantData;
  ph?: PollutantData;
  [key: string]: PollutantData | undefined;
}

interface UseCPCBAirQualityResult {
  data: CPCBAirQuality | null;
  loading: boolean;
  error: string | null;
}

const API_BASE = 'http://182.75.69.206:8080/v1.0';

export function useCPCBAirQuality(
  industryId: string = 'delhi-industries',
  stationId: string = 'delhi-etp-01'
): UseCPCBAirQualityResult {
  const [data, setData] = useState<CPCBAirQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/industry/${industryId}/station/${stationId}/data`, {
      method: 'POST',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch CPCB data');
        const json = await res.json();
        if (!Array.isArray(json) || json.length === 0) {
          throw new Error('No data returned from CPCB API');
        }
        // Normalize pollutant data
        const pollutants: CPCBAirQuality = {};
        for (const device of json) {
          if (Array.isArray(device.params)) {
            for (const param of device.params) {
              pollutants[param.parameter.toLowerCase()] = {
                value: param.value,
                unit: param.unit,
                timestamp: param.timestamp,
              };
            }
          }
        }
        setData(pollutants);
      })
      .catch((err) => {
        setError(err.message || 'Unknown error');
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [industryId, stationId]);

  return { data, loading, error };
} 