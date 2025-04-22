import { Cartesian3 } from "cesium";
import { create } from "zustand";
import stationData from "../cesium/data/groundStations.json";

// Enum of the different type of frequencies
export enum FrequencyType {
  UHF = "UHF",
  VHF = "VHF",
  S = "S-Band",
  X = "X-Band",
  Ku = "Ku-Band",
  Ka = "Ka-Band",
}

// Position type for the ground station
export interface Position {
  lat: number;
  lon: number;
  alt?: number;
}

export interface GroundStation {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  altitude: number;
  frequencies: FrequencyType[];
  cartesianPosition: Cartesian3;
  color: string;
  owner: string;
  costPerMb: number;
  description: string;
}

interface GroundStationState {
  stations: Map<string, GroundStation>;
  getStation: (id: string) => GroundStation | undefined;
  getAllStations: () => GroundStation[];
  createStation: (
    station: {
      id: string;
      name: string;
      lon: number;
      lat: number;
      alt?: number;
      frequencies: FrequencyType[];
      color: string;
      owner: string;
      costPerMb: number;
      description: string;
    } & Position
  ) => void;
}

export const useGroundStationStore = create<GroundStationState>((set, get) => ({
  stations: new Map(),

  getStation: (id: string) => {
    return get().stations.get(id);
  },

  getAllStations: () => {
    return Array.from(get().stations.values());
  },

  createStation: (station) => {
    const cartesianPosition = Cartesian3.fromDegrees(
      station.lon,
      station.lat,
      station.alt || 0
    );
    const newStation: GroundStation = {
      id: station.id,
      name: station.name,
      longitude: station.lon,
      latitude: station.lat,
      altitude: station.alt || 0,
      frequencies: station.frequencies.map(
        (frequency) => frequency as FrequencyType
      ),
      cartesianPosition,
      color: station.color,
      owner: station.owner,
      costPerMb: station.costPerMb,
      description: station.description,
    };
    const updatedStations = new Map(get().stations);
    updatedStations.set(station.id, newStation);
    set({ stations: updatedStations });
  },
}));

// Initialize the store with data
const initializeStore = () => {
  const stations = new Map<string, GroundStation>();

  stationData.forEach((station) => {
    const position = Cartesian3.fromDegrees(
      station.lon,
      station.lat,
      station.alt || 0
    );

    stations.set(station.id, {
      id: station.id,
      name: station.name,
      longitude: station.lon,
      latitude: station.lat,
      altitude: station.alt || 0,
      frequencies: station.frequencies.map(
        (frequency) => frequency as FrequencyType
      ),
      cartesianPosition: position,
      color: station.color,
      owner: station.owner,
      costPerMb: station.costPerMb,
      description: station.description,
    });
  });

  useGroundStationStore.setState({ stations });
};

// Initialize the store when the module is loaded
initializeStore();
