import { SampledPositionProperty, Cartesian3, JulianDate } from "cesium";
import { create } from "zustand";
import { satellitesApi } from "../services/api";

// Helper function to create orbit positions from TLE data
const createOrbitPosition = (satelliteId: string, tleData: { line1: string; line2: string }): SampledPositionProperty => {
  const positions = new SampledPositionProperty();
  
  // Create unique orbit based on satellite ID
  const baseAltitude = 400000 + (parseInt(satelliteId.slice(-1), 16) || 0) * 50000;
  const inclination = 45 + (parseInt(satelliteId.slice(-2), 16) || 0) * 5;
  const period = 90 + (parseInt(satelliteId.slice(-3), 16) || 0) * 2; // minutes
  
  // Generate orbit points
  const timeStep = 1; // 1 minute intervals
  const totalTime = period * 60; // Convert to seconds
  
  for (let i = 0; i <= totalTime; i += timeStep * 60) {
    const time = i / 60; // Convert to minutes
    const angle = (time / period) * 2 * Math.PI;
    
    // Simple circular orbit with variations
    const x = Math.cos(angle) * (6371000 + baseAltitude);
    const y = Math.sin(angle) * Math.cos(inclination * Math.PI / 180) * (6371000 + baseAltitude);
    const z = Math.sin(angle) * Math.sin(inclination * Math.PI / 180) * (6371000 + baseAltitude);
    
    const julianDate = JulianDate.fromDate(new Date(Date.now() + i * 1000));
    positions.addSample(julianDate, new Cartesian3(x, y, z));
  }
  
  return positions;
};

export interface Satellite {
  id: string;
  name: string;
  frequencies: string[];
  position?: SampledPositionProperty; // Optional now since we use CZML
  pathColor: string;
  model?: string; // Added model property for rendering
  modelScale?: number; // Added modelScale property
  description?: string;
  tle?: {
    line1: string;
    line2: string;
  };
}

interface SatelliteState {
  satellites: Map<string, Satellite>;
  selectedSatelliteId: string | null;
  isLoading: boolean;
  getSatellite: (id: string) => Satellite | undefined;
  getAllSatellites: () => Satellite[];
  updateSatellitePosition: (
    id: string,
    position: SampledPositionProperty
  ) => void;
  updateSatellite: (id: string, updates: Partial<Satellite>) => void;
  setSelectedSatellite: (id: string | null) => void;
  createSatellite: (sat: {
    id: string;
    name: string;
    tle: {
      line1: string;
      line2: string;
    };
    frequencies: string[];
    pathColor?: string;
    model?: string;
    modelScale?: number;
    description?: string;
  }) => void;
  refreshSatellites: () => Promise<void>;
}

export const useSatelliteStore = create<SatelliteState>((set, get) => ({
  satellites: new Map(),
  selectedSatelliteId: null,
  isLoading: false,

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

  updateSatellite: (id: string, updates: Partial<Satellite>) => {
    const satellite = get().satellites.get(id);
    if (satellite) {
      const updatedSatellites = new Map(get().satellites);
      updatedSatellites.set(id, { ...satellite, ...updates });
      set({ satellites: updatedSatellites });
    }
  },

  setSelectedSatellite: (id: string | null) => {
    set({ selectedSatelliteId: id });
  },

  createSatellite: (sat) => {
    const newSatellite: Satellite = {
      id: sat.id,
      name: sat.name,
      tle: sat.tle,
      frequencies: sat.frequencies,
      pathColor: sat.pathColor || "#00ffff",
      model: sat.model,
      description: sat.description,
      modelScale: sat.modelScale || 10000,
    };
    const updatedSatellites = new Map(get().satellites);
    updatedSatellites.set(sat.id, newSatellite);
    set({ satellites: updatedSatellites });
  },

  refreshSatellites: async () => {
    set({ isLoading: true });
    try {
      const satelliteData = await satellitesApi.getAll();
      const satellites = new Map<string, Satellite>();

      satelliteData.forEach((sat: any) => {
        // Ensure TLE data is properly formatted
        const tleData = sat.tle || {
          line1: sat.tleLine1 || "",
          line2: sat.tleLine2 || ""
        };
        
        console.log(`Processing satellite ${sat.id}:`, {
          name: sat.name,
          tle: tleData,
          hasTle: !!tleData.line1 && !!tleData.line2
        });
        
        // Create orbit position from TLE data
        const orbitPosition = createOrbitPosition(sat.id, tleData);
        
        satellites.set(sat.id, {
          id: sat.id,
          name: sat.name,
          frequencies: sat.frequencies,
          pathColor: sat.pathColor || "#00ffff",
          model: sat.modelAssetId ? sat.modelAssetId.toString() : undefined,
          description: sat.description,
          tle: tleData,
          modelScale: sat.modelScale || 10000,
          position: orbitPosition, // Add the orbit position
        });
      });

      set({ satellites, isLoading: false });
      console.log(`✅ Refreshed ${satellites.size} satellites from API`);
    } catch (error) {
      console.error('❌ Failed to refresh satellites from API:', error);
      set({ isLoading: false });
    }
  },
}));

// Store will be initialized by the useApiData hook
// No automatic initialization here to avoid conflicts
