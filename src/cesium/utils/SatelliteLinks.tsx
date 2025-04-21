import { Color, SampledPositionProperty, Cartesian3, JulianDate } from "cesium";
import { Entity, PolylineGraphics } from "resium";
import { useEffect, useState, useRef } from "react";
import { LinkGenerator } from "./LinkGenerator";
import { GroundStationDataGenerator } from "./GroundStationDataGenerator";

interface Link {
  satelliteId: string;
  stationId: string;
  color: Color;
  position: SampledPositionProperty;
}

export const SatelliteLinks = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [linkGenerator] = useState(() => new LinkGenerator());
  const [groundStationGenerator] = useState(() => new GroundStationDataGenerator());
  const updateInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const updateLinks = () => {
      // Get all ground stations
      const stations = groundStationGenerator.getAllStations();
      
      // Get all satellite entities from the DOM
      const satelliteEntities = document.querySelectorAll('[data-entity-id]');
      
      satelliteEntities.forEach(entity => {
        const satelliteId = entity.getAttribute('data-entity-id');
        if (satelliteId) {
          const position = (entity as any).position;
          if (position) {
            linkGenerator.updateSatellitePosition(satelliteId, position);
          }
        }
      });

      const newLinks = linkGenerator.getLinks();
      console.log('Updated links:', newLinks);
      setLinks(newLinks);
    };

    // Initial update
    updateLinks();

    // Update periodically
    updateInterval.current = setInterval(updateLinks, 1000);

    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, [linkGenerator, groundStationGenerator]);

  return (
    <>
      {links.map((link, index) => {
        const station = groundStationGenerator.getStation(link.stationId);
        if (!station) return null;

        // Create a sampled position property for the line
        const linePositions = new SampledPositionProperty();
        const time = JulianDate.now();
        
        // Get the current satellite position
        const satellitePos = link.position.getValue(time);
        if (!satellitePos) return null;

        // Add the satellite position
        linePositions.addSample(time, satellitePos);
        
        // Add the ground station position
        linePositions.addSample(time, station.position);

        return (
          <Entity key={`${link.satelliteId}-${link.stationId}-${index}`}>
            <PolylineGraphics
              positions={linePositions}
              width={2}
              material={link.color}
              arcType={1} // Use geodesic lines
              show={true}
              clampToGround={false}
            />
          </Entity>
        );
      })}
    </>
  );
}; 