import { create } from 'zustand';
import { Cartesian3 } from 'cesium';
import stationData from '../cesium/data/groundStations.json';

export interface GroundStation {
  id: string;
  name: string;
  frequencies: string[];
  position: Cartesian3;
  color: string;
  owner: string;
  costPerMb: number;
  description: string;
}

interface GroundStationState {
  stations: Map<string, GroundStation>;
  getStation: (id: string) => GroundStation | undefined;
  getAllStations: () => GroundStation[];
}

export const useGroundStationStore = create<GroundStationState>((set, get) => ({
  stations: new Map(),
  
  getStation: (id: string) => {
    return get().stations.get(id);
  },
  
  getAllStations: () => {
    return Array.from(get().stations.values());
  },
}));

// Initialize the store with data
const initializeStore = () => {
  const stations = new Map<string, GroundStation>();
  
  stationData.forEach(station => {
    const position = Cartesian3.fromDegrees(
      station.lon,
      station.lat,
      station.alt || 0
    );
    
    stations.set(station.id, {
      id: station.id,
      name: station.name,
      frequencies: station.frequencies,
      position,
      color: station.color,
      owner: station.owner,
      costPerMb: station.costPerMb,
      description: station.description
    });
  });
  
  useGroundStationStore.setState({ stations });
};

// Initialize the store when the module is loaded
initializeStore(); 