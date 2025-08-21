import { ArcType, CallbackProperty, Color, PolylineDashMaterialProperty, Cartesian3 } from "cesium";
import { useGroundStationStore } from "@/store/useGroundStationStore";
import { useSatelliteStore } from "@/store/useSatelliteStore";
import { useEffect, useRef } from "react";
import { useCesium } from "resium";

// Helper function to normalize frequency strings for comparison
const normalizeFrequency = (freq: string): string => {
  return freq.toLowerCase().replace(/\s+/g, '');
};

export const LinkVisualizer = () => {
  const { viewer } = useCesium();
  const linkEntitiesRef = useRef<any[]>([]);
  const groundStations = useGroundStationStore((state) => state.getAllStations());
  const satellites = useSatelliteStore((state) => state.getAllSatellites());

  useEffect(() => {
    if (!viewer || groundStations.length === 0 || satellites.length === 0) {
      return;
    }

    // Clear existing link entities
    linkEntitiesRef.current.forEach(entity => {
      viewer.entities.remove(entity);
    });
    linkEntitiesRef.current = [];

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
          const link = viewer.entities.add({
            polyline: {
              positions: new CallbackProperty(() => {
                const satPos = satellite.position?.getValue(viewer.clock.currentTime);
                const gsPos = station.cartesianPosition;
                
                if (!satPos || !gsPos) return [];

                // Visibility check: satellite is above horizon at ground station
                const gsToSat = Cartesian3.subtract(satPos, gsPos, new Cartesian3());
                const gsUp = Cartesian3.normalize(gsPos, new Cartesian3());
                const dot = Cartesian3.dot(gsToSat, gsUp);

                return dot > 0 ? [gsPos, satPos] : []; // draw only if visible
              }, false),
              width: 2,
              material: new PolylineDashMaterialProperty({
                color: Color.GREEN,
                dashLength: 16
              }),
              arcType: ArcType.NONE,
            },
          });
          linkEntitiesRef.current.push(link);
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
          const link = viewer.entities.add({
            polyline: {
              positions: new CallbackProperty(() => {
                const sat1Pos = sat1.position?.getValue(viewer.clock.currentTime);
                const sat2Pos = sat2.position?.getValue(viewer.clock.currentTime);
                
                if (!sat1Pos || !sat2Pos) return [];

                return [sat1Pos, sat2Pos];
              }, false),
              width: 1,
              material: new PolylineDashMaterialProperty({
                color: Color.RED,
                dashLength: 12
              }),
              arcType: ArcType.NONE,
            },
          });
          linkEntitiesRef.current.push(link);
        }
      });
    });

    // Cleanup function
    return () => {
      linkEntitiesRef.current.forEach(entity => {
        viewer.entities.remove(entity);
      });
      linkEntitiesRef.current = [];
    };
  }, [viewer, groundStations, satellites]);

  return null; // This component doesn't render anything directly
}; 