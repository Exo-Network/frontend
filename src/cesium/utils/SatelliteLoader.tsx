import { useSatelliteStore } from "@/store/useSatelliteStore";
import {
  Cartesian3,
  Color,
  CallbackProperty,
} from "cesium";
import { Entity } from "resium";
import React from "react";

export const hexToCesiumColor = (hex: string): Color => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return new Color(r, g, b);
};

// Helper function to create pulsing bubble size
const createPulsingBubbleSize = (baseSize: number) => {
  return new CallbackProperty((time) => {
    if (!time) return new Cartesian3(baseSize, baseSize, baseSize);
    const pulse = Math.sin(time.secondsOfDay * 0.5) * 0.2 + 1; // Pulsing effect
    return new Cartesian3(baseSize * pulse, baseSize * pulse, baseSize * pulse);
  }, false);
};

export const SatellitesEntities = () => {
  const satellites = useSatelliteStore((state) => state.satellites);
  const selectedSatelliteId = useSatelliteStore(
    (state) => state.selectedSatelliteId
  );

  console.log("SatellitesEntities: Rendering", satellites.size, "satellites");

  return (
    <>
      {Array.from(satellites.values()).map((sat) => {
        console.log("SatellitesEntities: Satellite", sat.name, "position:", sat.position);
        return (
          <React.Fragment key={sat.id}>
            <Entity
              name={sat.name}
              position={sat.position}
              path={{
                resolution: 1,
                material: hexToCesiumColor(sat.pathColor),
                width: 2,
                leadTime: Number.POSITIVE_INFINITY,
                trailTime: Number.POSITIVE_INFINITY,
              }}
              point={{
                pixelSize: 8,
                color: hexToCesiumColor(sat.pathColor),
                outlineColor: Color.BLACK,
                outlineWidth: 1,
              }}
              {...(sat.model && {
                model: {
                  uri: "/models/Sentinel-6.glb",
                  scale: 1000,
                },
              })}
              description={`<div style="color: white; padding: 15px; background: rgba(0,0,0,0.8); border-radius: 8px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 10px 0; color: #4CAF50; border-bottom: 2px solid #4CAF50; padding-bottom: 5px;">${sat.name}</h3>
                <p style="margin: 5px 0;"><strong style="color: #FFD700;">Frequencies:</strong> ${sat.frequencies.join(", ")}</p>
                <p style="margin: 5px 0; font-style: italic; color: #E0E0E0;">${sat.description}</p>
              </div>`}
            />
            {/* Master satellite bubble - only show when selected */}
            {sat.isMaster && selectedSatelliteId === sat.id && (
              <Entity
                name={`${sat.name} Master Bubble`}
                position={sat.position}
                ellipsoid={{
                  radii: createPulsingBubbleSize(sat.masterRange),
                  material: hexToCesiumColor(sat.pathColor).withAlpha(0.08), // Semi-transparent
                  outline: true,
                  outlineColor: hexToCesiumColor("#800080"),
                  outlineWidth: 2,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
