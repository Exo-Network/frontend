import * as Cesium from "@cesium/engine";
import {
  ArcType,
  CallbackProperty,
  Cartesian3,
  Color,
  PolylineDashMaterialProperty,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  SampledPositionProperty,
  JulianDate,
  Ellipsoid,
} from "cesium";
import * as satellitejs from "satellite.js";

import { useGroundStationStore } from "@/store/useGroundStationStore";
import { useSatelliteStore } from "@/store/useSatelliteStore";
import { generateMultiSatelliteCzml } from "./utils/orbit";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useEffect, useRef, useState } from "react";
import { ImageryLayer, Viewer, useCesium } from "resium";
import { GroundStations } from "./utils/GroundStationLoader";

// Helper function to normalize frequency strings for comparison
const normalizeFrequency = (freq: string): string => {
  return freq.toLowerCase().replace(/\s+/g, "");
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

const SatelliteLoader = () => {
  const { viewer } = useCesium();
  const satellites = useSatelliteStore((state) => state.satellites);
  const [satelliteEntities, setSatelliteEntities] = useState<any[]>([]);

  useEffect(() => {

    if (!viewer || satellites.size === 0) {
      return;
    }


    // Create satellite entities using proper SGP4 orbital propagation
    const entities = Array.from(satellites.values())
      .filter(sat => sat.tle)
      .map(sat => {
        
        try {
          // Parse TLE using satellite.js
          const satrec = satellitejs.twoline2satrec(sat.tle!.line1, sat.tle!.line2);
          
          if (satrec.error) {
            return null;
          }
          
          
          // Calculate orbital period from mean motion for path visualization
          const meanMotionRad = satrec.no; // Mean motion in radians per minute
          const orbitalPeriod = (2 * Math.PI) / meanMotionRad * 60; // Convert to seconds
                    
          // Create a sampled position property with extended coverage for continuous appearance
          // This covers multiple orbital periods to simulate continuous looping
          const positionProperty = new SampledPositionProperty();
          const startTime = JulianDate.now();
          
          // Cover 10 orbital periods to ensure continuous appearance
          // Also add some backward time coverage to ensure satellites appear immediately
          const numOrbits = 10;
          const totalTime = orbitalPeriod * numOrbits;
          const backwardTime = orbitalPeriod * 0.5; // Cover half an orbit backward
          const numSamples = 360 * numOrbits; // 360 samples per orbit
          
          
          for (let i = 0; i <= numSamples; i++) {
            const time = JulianDate.addSeconds(startTime, (i * (totalTime / numSamples)) - backwardTime, new JulianDate());
            const jsDate = JulianDate.toDate(time);
            
            // Propagate satellite position using SGP4
            const result = satellitejs.propagate(satrec, jsDate);
            
            if (result && result.position) {
              // Convert satellite.js position (km) to Cesium position (meters)
              const positionEci = result.position;
              const position = new Cartesian3(
                positionEci.x * 1000, // Convert km to meters
                positionEci.y * 1000,
                positionEci.z * 1000
              );
              
              positionProperty.addSample(time, position);
            }
          }
          
          // Create the entity
          const entity = viewer.entities.add({
            id: sat.id,
            name: sat.name,
            description: sat.description || "",
            position: positionProperty,
            
            // 3D Model - choose appropriate model based on satellite type
            model: {
              uri: sat.name.toLowerCase().includes('molniya') 
                ? "/models/Sentinel-6.glb"  // Large satellite for Molniya
                : sat.name.toLowerCase().includes('equa') 
                ? "/models/Sentinel-6.glb"  // Large satellite for EquaCom
                : "/models/CubeSat-1RU.glb", // Small CubeSat for InclinaSats
              scale: sat.modelScale || 1000,
              minimumPixelSize: 32,
              maximumScale: 20000,
            },
            
            point: {
              pixelSize: 8,
              color: Cesium.Color.fromCssColorString(sat.pathColor),
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 1,
            },
            
            path: {
              material: Cesium.Color.fromCssColorString(sat.pathColor),
              width: 2,
              leadTime: orbitalPeriod, // Show path for one orbital period
              trailTime: orbitalPeriod, // Show trail for one orbital period
            },
            
            // Master satellite bubble (if applicable)
            ...(sat.isMaster && {
              ellipsoid: {
                radii: new Cesium.Cartesian3(sat.masterRange || 1000000, sat.masterRange || 1000000, sat.masterRange || 1000000),
                material: Cesium.Color.fromCssColorString(sat.pathColor).withAlpha(0.1),
                outline: true,
                outlineColor: Cesium.Color.PURPLE,
              }
            })
          });
          
          return entity;
          
        } catch (error) {
          return null;
        }
      })
      .filter(entity => entity !== null); // Remove any failed entities
    
    setSatelliteEntities(entities);

    // Cleanup function
    return () => {
      entities.forEach(entity => {
        if (entity) {
          viewer.entities.remove(entity);
        }
      });
      setSatelliteEntities([]);
    };
  }, [viewer, satellites]);

  return null;
};

const LinkCreator = () => {
  const { viewer } = useCesium();
  const linkEntitiesRef = useRef<any[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!viewer || initializedRef.current) {
      return;
    }


    // Get data from stores without subscribing
    const groundStations = useGroundStationStore.getState().getAllStations();
    const satellites = useSatelliteStore.getState().getAllSatellites();


    if (groundStations.length === 0 || satellites.length === 0) {
      return;
    }

    initializedRef.current = true;

    let linkCount = 0;

    // Create links between ground stations and satellites (green)
    groundStations.forEach((station) => {
      satellites.forEach((satellite) => {
        // Check if they have compatible frequencies (case-insensitive)
        const hasCompatibleFrequencies = station.frequencies.some(
          (stationFreq) =>
            satellite.frequencies.some(
              (satFreq) =>
                normalizeFrequency(stationFreq) === normalizeFrequency(satFreq)
            )
        );

        if (hasCompatibleFrequencies) {
          const link = viewer.entities.add({
            polyline: {
              positions: new CallbackProperty(() => {
                // For CZML satellites, we need to get position from the data source
                const satEntity = viewer.entities.getById(satellite.id);
                const satPos = satEntity?.position?.getValue(viewer.clock.currentTime);
                const gsPos = station.cartesianPosition;

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
              width: 2,
              material: new PolylineDashMaterialProperty({
                color: Color.GREEN,
                dashLength: 20,
              }),
              arcType: ArcType.NONE,
            },
          });
          linkEntitiesRef.current.push(link);
          linkCount++;
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
                const sat1Entity = viewer.entities.getById(sat1.id);
                const sat2Entity = viewer.entities.getById(sat2.id);
                const sat1Pos = sat1Entity?.position?.getValue(viewer.clock.currentTime);
                const sat2Pos = sat2Entity?.position?.getValue(viewer.clock.currentTime);

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
          linkCount++;
        }
      });
    });

    // Cleanup function
    return () => {
      linkEntitiesRef.current.forEach((entity) => {
        viewer.entities.remove(entity);
      });
      linkEntitiesRef.current = [];
      initializedRef.current = false;
    };
  }, [viewer]);

  return null;
};

const SelectionHandler = () => {
  const { viewer } = useCesium();
  const setSelectedSatellite = useSatelliteStore(
    (state) => state.setSelectedSatellite
  );
  const satellites = useSatelliteStore((state) => state.satellites);

  useEffect(() => {
    if (!viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((event: any) => {
      const pickedObject = viewer.scene.pick(event.position);

      if (pickedObject && pickedObject.id) {
        const entityName = pickedObject.id.name;
        // Find the satellite by name
        const satellite = Array.from(satellites.values()).find(
          (sat) => sat.name === entityName
        );

        if (satellite) {
          setSelectedSatellite(satellite.id);
        } else {
          setSelectedSatellite(null);
        }
      } else {
        setSelectedSatellite(null);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
    };
  }, [viewer, setSelectedSatellite, satellites]);

  return null;
};

export const CesiumViewer = () => {
  const offline = true;
  const viewerRef = useRef<any>(null);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Viewer
        full
        ref={viewerRef}
        scene3DOnly={false}
        baseLayerPicker={false}
        geocoder={false}
        homeButton={false}
        navigationHelpButton={false}
        animation={true}
        timeline={true}
        fullscreenButton={false}
        vrButton={false}
        selectionIndicator={false}
        infoBox={false}
        requestRenderMode={true}
        maximumRenderTimeChange={Infinity}
      >
        <ImageryLayer
          imageryProvider={Cesium.TileMapServiceImageryProvider.fromUrl(
            "/cesium/NaturalEarthII",
            {
              maximumLevel: 5,
              credit: "Imagery courtesy Natural Earth",
            }
          )}
        />
        
        {/* Render ground stations */}
        <GroundStations />
        
        {/* Render satellites via CZML */}
        <SatelliteLoader />
        
        {/* Render links between entities */}
        <LinkCreator />
        
        {/* Handle satellite selection */}
        <SelectionHandler />
        
      </Viewer>
    </div>
  );
};
