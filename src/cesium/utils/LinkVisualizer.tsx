import { ArcType, CallbackProperty, Color, PolylineDashMaterialProperty, Cartesian3, Ellipsoid } from "cesium";
import { useGroundStationStore } from "@/store/useGroundStationStore";
import { useSatelliteStore } from "@/store/useSatelliteStore";
import { useEffect, useRef } from "react";
import { useCesium } from "resium";

// Helper function to normalize frequency strings for comparison
const normalizeFrequency = (freq: string): string => {
  return freq.toLowerCase().replace(/\s+/g, '');
};

// Helper function to check if Earth blocks line of sight between two points
const isEarthBlocking = (pos1: Cartesian3, pos2: Cartesian3): boolean => {
  const earthRadius = Ellipsoid.WGS84.maximumRadius;
  
  // Vector from pos1 to pos2
  const direction = Cartesian3.subtract(pos2, pos1, new Cartesian3());
  const distance = Cartesian3.magnitude(direction);
  
  if (distance === 0) return false;
  
  // Check more points along the line for better accuracy
  // Use a fixed number of checks regardless of distance for consistency
  const numChecks = 20; // Check 20 points along the line
  
  for (let i = 1; i < numChecks; i++) {
    const t = i / numChecks;
    const checkPoint = Cartesian3.lerp(pos1, pos2, t, new Cartesian3());
    
    // Calculate distance from Earth center to this point
    const distanceFromCenter = Cartesian3.magnitude(checkPoint);
    
    // If any point along the line is below Earth's surface, Earth is blocking
    // Add a small buffer (1km) to account for Earth's atmosphere and ensure clean cutoff
    if (distanceFromCenter < (earthRadius + 1000)) {
      return true;
    }
  }
  
  return false;
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

                // Check if Earth is blocking the line of sight between satellites
                if (isEarthBlocking(sat1Pos, sat2Pos)) {
                  return []; // Don't draw link if Earth is blocking
                }

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