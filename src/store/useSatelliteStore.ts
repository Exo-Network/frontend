import { createSampledPosition } from "@/cesium/utils/orbit";
import { JulianDate, SampledPositionProperty } from "cesium";
import { create } from "zustand";
import satelliteData from "../cesium/data/satellites.json";

export interface Satellite {
  id: string;
  name: string;
  frequencies: string[];
  position: SampledPositionProperty;
  pathColor: string;
  model?: string; // Added model property for rendering
  modelScale?: number; // Added modelScale property
  description?: string;
  isMaster?: boolean;
  masterRange: number;
  orbit?: {
    semiMajorAxis?: number;
    eccentricity?: number;
    inclination?: number;
    raan?: number;
    argOfPeriapsis?: number;
  };
}

interface SatelliteState {
  satellites: Map<string, Satellite>;
  selectedSatelliteId: string | null;
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
    orbit: {
      semiMajorAxis?: number;
      eccentricity?: number;
      inclination?: number;
      raan?: number;
      argOfPeriapsis?: number;
    };
    frequencies: string[];
    pathColor?: string;
    model?: string;
    modelScale?: number;
    description?: string;
    isMaster?: boolean;
    masterRange?: number;
  }) => void;
}

export const useSatelliteStore = create<SatelliteState>((set, get) => ({
  satellites: new Map(),
  selectedSatelliteId: null,

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
    const orbitParams = {
      semiMajorAxis: sat.orbit.semiMajorAxis || 0,
      eccentricity: sat.orbit.eccentricity || 0,
      inclination: sat.orbit.inclination || 0,
      raan: sat.orbit.raan || 0,
      argOfPeriapsis: sat.orbit.argOfPeriapsis || 0,
    };
    const position = createSampledPosition(orbitParams, JulianDate.now(), 1400);
    const newSatellite: Satellite = {
      id: sat.id,
      name: sat.name,
      orbit: sat.orbit,
      frequencies: sat.frequencies,
      pathColor: sat.pathColor || "#00ffff",
      model: sat.model,
      description: sat.description,
      isMaster: sat.isMaster,
      masterRange: sat.masterRange || 0,
      position,
      modelScale: sat.modelScale || 10000,
    };
    const updatedSatellites = new Map(get().satellites);
    updatedSatellites.set(sat.id, newSatellite);
    set({ satellites: updatedSatellites });
  },
}));

// Initialize the store with data
const initializeStore = () => {
  const satellites = new Map<string, Satellite>();

  satelliteData.forEach((sat) => {
    satellites.set(sat.id, {
      id: sat.id,
      name: sat.name,
      frequencies: sat.frequencies,
      position: createSampledPosition(sat.orbit, JulianDate.now(), 1400),
      pathColor: sat.pathColor || "#00ffff",
      model: sat.modelAssetId.toString(),
      description: sat.description,
      isMaster: sat.isMaster,
      masterRange: sat.masterRange || 0,
      orbit: sat.orbit,
      modelScale: sat.modelScale || 10000,
    });
  });

  useSatelliteStore.setState({ satellites });
};

// Initialize the store when the module is loaded
initializeStore();
