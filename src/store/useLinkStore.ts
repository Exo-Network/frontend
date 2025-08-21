import { Cartesian3, Color, JulianDate } from "cesium";
import { create } from "zustand";
import { useGroundStationStore } from "./useGroundStationStore";
import { useSatelliteStore } from "./useSatelliteStore";

export interface Link {
  id: string;
  startPosition: Cartesian3;
  endPosition: Cartesian3;
  color: Color;
  width: number;
  type: 'ground-to-satellite' | 'satellite-to-satellite';
  startEntityId: string;
  endEntityId: string;
}

interface LinkState {
  links: Link[];
  updateLinks: () => void;
  getLinks: () => Link[];
}

// Helper function to normalize frequency strings for comparison
const normalizeFrequency = (freq: string): string => {
  return freq.toLowerCase().replace(/\s+/g, '');
};

export const useLinkStore = create<LinkState>((set, get) => ({
  links: [],

  updateLinks: () => {
    try {
      const groundStations = useGroundStationStore.getState().getAllStations();
      const satellites = useSatelliteStore.getState().getAllSatellites();
      
      if (groundStations.length === 0 || satellites.length === 0) {
        return; // Don't update if data isn't ready
      }
      
      const newLinks: Link[] = [];
      let linkId = 0;

      // Create links between ground stations and satellites (green)
      groundStations.forEach((station) => {
        satellites.forEach((satellite) => {
          // Check if they have compatible frequencies (case-insensitive)
          const hasCompatibleFrequencies = station.frequencies.some((stationFreq) =>
            satellite.frequencies.some((satFreq) => 
              normalizeFrequency(stationFreq) === normalizeFrequency(satFreq)
            )
          );

          if (hasCompatibleFrequencies) {
            // Get current satellite position
            const currentTime = JulianDate.now();
            const satellitePosition = satellite.position.getValue(currentTime);
            
            if (satellitePosition) {
              newLinks.push({
                id: `gs-sat-${linkId++}`,
                startPosition: station.cartesianPosition,
                endPosition: satellitePosition,
                color: Color.GREEN,
                width: 2,
                type: 'ground-to-satellite',
                startEntityId: station.id,
                endEntityId: satellite.id,
              });
            }
          }
        });
      });

      // Create links between satellites (red)
      satellites.forEach((sat1, index1) => {
        satellites.slice(index1 + 1).forEach((sat2) => {
          // Check if they have compatible frequencies (case-insensitive)
          const hasCompatibleFrequencies = sat1.frequencies.some((freq1) =>
            sat2.frequencies.some((freq2) => 
              normalizeFrequency(freq1) === normalizeFrequency(freq2)
            )
          );

          if (hasCompatibleFrequencies) {
            // Get current positions for both satellites
            const currentTime = JulianDate.now();
            const sat1Position = sat1.position.getValue(currentTime);
            const sat2Position = sat2.position.getValue(currentTime);
            
            if (sat1Position && sat2Position) {
              newLinks.push({
                id: `sat-sat-${linkId++}`,
                startPosition: sat1Position,
                endPosition: sat2Position,
                color: Color.RED,
                width: 1,
                type: 'satellite-to-satellite',
                startEntityId: sat1.id,
                endEntityId: sat2.id,
              });
            }
          }
        });
      });

      set({ links: newLinks });
    } catch (error) {
      console.warn('Error updating links:', error);
    }
  },

  getLinks: () => {
    return get().links;
  },
})); 