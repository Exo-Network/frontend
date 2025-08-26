import { SampledPositionProperty } from "cesium";
import { create } from "zustand";
import { satellitesApi } from "../services/api";

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
        satellites.set(sat.id, {
          id: sat.id,
          name: sat.name,
          frequencies: sat.frequencies,
          pathColor: sat.pathColor || "#00ffff",
          model: sat.modelAssetId ? sat.modelAssetId.toString() : undefined,
          description: sat.description,
          isMaster: sat.isMaster,
          masterRange: sat.masterRange || 0,
          tle: sat.tle,
          modelScale: sat.modelScale || 10000,
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
