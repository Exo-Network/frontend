import { useEffect, useState, useCallback, useRef } from 'react';
import { useGroundStationStore } from '@/store/useGroundStationStore';
import { useSatelliteStore } from '@/store/useSatelliteStore';

export const useApiData = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);
  
  // Get loading states and data to check if already loaded
  const groundStationLoading = useGroundStationStore((state) => state.isLoading);
  const satelliteLoading = useSatelliteStore((state) => state.isLoading);
  const groundStationsCount = useGroundStationStore((state) => state.stations.size);
  const satellitesCount = useSatelliteStore((state) => state.satellites.size);
  
  const isLoading = groundStationLoading || satelliteLoading;
  const hasData = groundStationsCount > 0 || satellitesCount > 0;

  const refreshAllData = useCallback(async () => {
    console.log('🔄 Refreshing all data...');
    try {
      setError(null);
      const groundStationStore = useGroundStationStore.getState();
      const satelliteStore = useSatelliteStore.getState();
      
      await Promise.all([
        groundStationStore.refreshStations(),
        satelliteStore.refreshSatellites(),
      ]);
      
      setIsInitialized(true);
      hasInitialized.current = true;
      console.log('✅ All data refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    }
  }, []);

  const refreshGroundStations = useCallback(async () => {
    console.log('🔄 Refreshing ground stations...');
    try {
      setError(null);
      const groundStationStore = useGroundStationStore.getState();
      await groundStationStore.refreshStations();
      console.log('✅ Ground stations refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing ground stations:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh ground stations');
    }
  }, []);

  const refreshSatellites = useCallback(async () => {
    console.log('🔄 Refreshing satellites...');
    try {
      setError(null);
      const satelliteStore = useSatelliteStore.getState();
      await satelliteStore.refreshSatellites();
      console.log('✅ Satellites refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing satellites:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh satellites');
    }
  }, []);

  useEffect(() => {
    console.log('🔧 useApiData useEffect triggered, hasInitialized:', hasInitialized.current, 'hasData:', hasData);
    
    // If we already have data, mark as initialized
    if (hasData && !isInitialized) {
      console.log('📊 Data already available, marking as initialized');
      setIsInitialized(true);
      hasInitialized.current = true;
      return;
    }
    
    // Only initialize once when the component mounts
    if (!hasInitialized.current) {
      console.log('🚀 Initializing data for the first time...');
      hasInitialized.current = true;
      refreshAllData();
    }
  }, [hasData, isInitialized, refreshAllData]);

  return {
    isLoading,
    isInitialized,
    error,
    refreshAllData,
    refreshGroundStations,
    refreshSatellites,
  };
};
