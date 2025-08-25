import { 
  Cartesian3, 
  JulianDate, 
  SampledPositionProperty, 
  LagrangePolynomialApproximation
} from "cesium";
import * as satellitejs from "satellite.js";

export type TleData = {
  line1: string;
  line2: string;
};

// Generate CZML document for a satellite from TLE
export const generateSatelliteCzml = (satellite: {
  id: string;
  name: string;
  tle: TleData;
  pathColor: string;
  modelScale?: number;
  description?: string;
  isMaster?: boolean;
  masterRange?: number;
}) => {
  const czml = [
    {
      id: "document",
      name: "ExoNet Satellites",
      version: "1.0",
      clock: {
        interval: "2023-01-01T00:00:00Z/2024-12-31T24:00:00Z",
        currentTime: "2023-01-01T00:00:00Z",
        multiplier: 60,
        range: "LOOP_STOP",
        step: "SYSTEM_CLOCK_MULTIPLIER"
      }
    },
    {
      id: satellite.id,
      name: satellite.name,
      availability: "2023-01-01T00:00:00Z/2024-12-31T24:00:00Z",
      description: satellite.description || "",
      
      // TLE-based orbital position - using the correct CZML format
      position: {
        epoch: "2023-01-01T00:00:00Z",
        tle: satellite.tle.line1 + "\n" + satellite.tle.line2
      },
      
      // Visual representation
      point: {
        pixelSize: 8,
        color: {
          rgba: hexToRgba(satellite.pathColor)
        },
        outlineColor: {
          rgba: [0, 0, 0, 255]
        },
        outlineWidth: 1
      },
      
      // Orbital path
      path: {
        material: {
          polylineDash: {
            color: {
              rgba: hexToRgba(satellite.pathColor)
            },
            dashLength: 16
          }
        },
        width: 2,
        leadTime: 86400, // 24 hours
        trailTime: 86400  // 24 hours
      },
      
      // Master satellite bubble (if applicable)
      ...(satellite.isMaster && {
        ellipsoid: {
          radii: satellite.masterRange || 1000000,
          material: {
            color: {
              rgba: [...hexToRgba(satellite.pathColor).slice(0, 3), 20] // Very transparent
            }
          },
          outline: true,
          outlineColor: {
            rgba: [128, 0, 128, 255] // Purple outline
          }
        }
      })
    }
  ];
  
  return czml;
};

// Helper function to convert hex color to RGBA array
const hexToRgba = (hex: string): number[] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b, 255];
};

// Generate CZML for multiple satellites
export const generateMultiSatelliteCzml = (satellites: Array<{
  id: string;
  name: string;
  tle: TleData;
  pathColor: string;
  modelScale?: number;
  description?: string;
  isMaster?: boolean;
  masterRange?: number;
}>) => {
  const czml = [
    {
      id: "document",
      name: "ExoNet Satellite Constellation",
      version: "1.0",
      clock: {
        interval: "2023-01-01T00:00:00Z/2024-12-31T24:00:00Z",
        currentTime: "2023-01-01T00:00:00Z",
        multiplier: 60,
        range: "LOOP_STOP",
        step: "SYSTEM_CLOCK_MULTIPLIER"
      }
    }
  ];
  
  // Add each satellite
  satellites.forEach(satellite => {
    const satelliteCzml = generateSatelliteCzml(satellite);
    // Add the satellite object (index 1) to the main CZML array
    czml.push(satelliteCzml[1] as any);
  });
  
  return czml;
};

// Legacy functions for backward compatibility
export const createSampledPositionFromTle = (
  tle: TleData,
  start: JulianDate,
  steps = 180,
  loop = true
): SampledPositionProperty => {
  // This is now deprecated - use CZML instead
  console.warn('createSampledPositionFromTle is deprecated. Use CZML for better performance.');
  
  const position = new SampledPositionProperty();
  const fallbackPosition = new Cartesian3(0, 0, 0);
  position.addSample(start, fallbackPosition);
  return position;
};

export const createExtendedOrbitalPath = (
  tle: TleData,
  start: JulianDate,
  numOrbits = 3,
  stepsPerOrbit = 120
): SampledPositionProperty => {
  // This is now deprecated - use CZML instead
  console.warn('createExtendedOrbitalPath is deprecated. Use CZML for better performance.');
  
  const position = new SampledPositionProperty();
  const fallbackPosition = new Cartesian3(0, 0, 0);
  position.addSample(start, fallbackPosition);
  return position;
};

export const createSampledPosition = createSampledPositionFromTle;