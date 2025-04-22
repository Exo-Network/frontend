import { create } from 'zustand';
import { Cartesian3, JulianDate, SampledPositionProperty } from 'cesium';
import satelliteData from '../cesium/data/satellites.json';
import { createSampledPosition } from '@/cesium/utils/orbit';

export interface Satellite {
  id: string;
  name: string;
  frequencies: string[];
  position: SampledPositionProperty;
  pathColor: string;
  model?: string; // Added model property for rendering
}

interface SatelliteState {
  satellites: Map<string, Satellite>;
  getSatellite: (id: string) => Satellite | undefined;
  getAllSatellites: () => Satellite[];
  updateSatellitePosition: (id: string, position: SampledPositionProperty) => void;
}

export const useSatelliteStore = create<SatelliteState>((set, get) => ({
  satellites: new Map(),
  
  getSatellite: (id: string) => {
    return get().satellites.get(id);
  },
  
  getAllSatellites: () => {
    return Array.from(get().satellites.values());
  },
  
  updateSatellitePosition: (id: string, position: SampledPositionProperty) => {
    const satellite = get().satellites.get(id);
    if (satellite) {
      const updatedSatellites = new Map(get().satellites);
      updatedSatellites.set(id, { ...satellite, position });
      set({ satellites: updatedSatellites });
    }
  },
}));

// Initialize the store with data
const initializeStore = () => {
  const satellites = new Map<string, Satellite>();
  
  satelliteData.forEach(sat => {
    satellites.set(sat.id, {
      id: sat.id,
      name: sat.name,
      frequencies: sat.frequencies,
      position: createSampledPosition(sat.orbit, JulianDate.now(),  1400),
      pathColor: sat.pathColor || "#00ffff",
      model: sat.modelAssetId.toString()
    });
  });
  
  useSatelliteStore.setState({ satellites });
};

// Initialize the store when the module is loaded
initializeStore();