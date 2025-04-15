import {
  ArcType,
  CallbackProperty,
  Cartesian3,
  ClockRange,
  Color,
  Entity,
  Ion,
  JulianDate,
  Viewer,
  createWorldTerrainAsync,
} from "cesium";
import { PolylineDashMaterialProperty } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useEffect, useRef } from "react";
import { GroundStationLoader } from "./utils/GroundStationLoader";
import { SatelliteLoader } from "./utils/SatelliteLoader";

export const CesiumViewer = () => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewerRefCesium = useRef<Viewer | null>(null);
  const satelliteRef = useRef<Entity | null>(null);

  const simulationDurationSeconds = 86400; // 1 hour of orbit simulation

  useEffect(() => {
    const initViewer = async () => {
      if (!viewerRef.current) return;

      Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

      const viewer = new Viewer(viewerRef.current, {
        terrainProvider: await createWorldTerrainAsync(),
      });

      viewerRefCesium.current = viewer;

      const start = JulianDate.now();
      const stop = JulianDate.addSeconds(
        start,
        simulationDurationSeconds,
        new JulianDate()
      );

      // Set clock parameters
      viewer.clock.startTime = start.clone();
      viewer.clock.stopTime = stop.clone();
      viewer.clock.currentTime = start.clone();
      viewer.clock.clockRange = ClockRange.LOOP_STOP;
      viewer.clock.multiplier = 50; // control orbit speed

      viewer.timeline.zoomTo(start, stop);
      viewer.clock.shouldAnimate = true;
      viewer.clock.shouldAnimate = false;
      viewer.trackedEntity = undefined;

      const loader = new SatelliteLoader(
        viewer,
        start,
        simulationDurationSeconds
      );
      const satellites = await loader.loadAllSatellites();

      if (satellites.length > 0) {
        viewer.trackedEntity = satellites[0];
        satelliteRef.current = satellites[0];
      }

      const gsLoader = new GroundStationLoader(viewer);
      const stationEntities = gsLoader.loadAllStations();
      const satelliteEntities = satellites;

      // Add link entities between each pair (one for now)
      const links: Entity[] = [];

      stationEntities.forEach((station) => {
        satelliteEntities.forEach((satellite) => {
          const link = viewer.entities.add({
            polyline: {
              positions: new CallbackProperty(() => {
                const satPos = satellite.position?.getValue(
                  viewer.clock.currentTime
                );
                const gsPos = station.position?.getValue(
                  viewer.clock.currentTime
                );
                if (!satPos || !gsPos) return [];

                // Visibility check: satellite is above horizon at ground station
                const gsToSat = Cartesian3.subtract(
                  satPos,
                  gsPos,
                  new Cartesian3()
                );
                const gsUp = Cartesian3.normalize(gsPos, new Cartesian3());
                const dot = Cartesian3.dot(gsToSat, gsUp);

                return dot > 0 ? [gsPos, satPos] : []; // draw only if visible
              }, false),
              width: 1.5,
              material: new PolylineDashMaterialProperty({
                color: Color.CYAN,
                dashLength: 16
              }),
              arcType: ArcType.NONE,
            },
          });
          links.push(link);
        });
      });

      return () => viewer.destroy();
    };

    initViewer();
  }, []);

  return (
    <>
      {/* UI for selecting satellites can go here if needed later */}
      <div ref={viewerRef} style={{ height: "100vh", width: "100%" }} />
    </>
  );
};
