import {
  Cartesian3,
  Color,
  JulianDate,
  Math as CesiumMath,
  Matrix3,
  SampledPositionProperty,
  IonResource,
} from "cesium";
import { Entity } from "resium";
import { useEffect, useState } from "react";
import satelliteData from "../data/satellites.json";

type OrbitParams = {
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  raan: number;
  argOfPeriapsis: number;
};

export const toECI = (angleDeg: number, orbit: OrbitParams): Cartesian3 => {
  const ν = CesiumMath.toRadians(angleDeg);
  const a = orbit.semiMajorAxis;
  const e = orbit.eccentricity;

  const r = (a * (1 - e * e)) / (1 + e * Math.cos(ν));
  const xOrb = r * Math.cos(ν);
  const yOrb = r * Math.sin(ν);
  const zOrb = 0;
  const perifocal = new Cartesian3(xOrb, yOrb, zOrb);

  const i = orbit.inclination;
  const Ω = orbit.raan;
  const ω = orbit.argOfPeriapsis;

  const Rz_RAAN = Matrix3.fromRotationZ(Ω, new Matrix3());
  const Rx_Inc = Matrix3.fromRotationX(i, new Matrix3());
  const Rz_ArgPeriapsis = Matrix3.fromRotationZ(ω, new Matrix3());

  const rotation = Matrix3.multiply(
    Rz_RAAN,
    Matrix3.multiply(Rx_Inc, Rz_ArgPeriapsis, new Matrix3()),
    new Matrix3()
  );

  return Matrix3.multiplyByVector(rotation, perifocal, new Cartesian3());
};

const createSampledPosition = (
  orbit: OrbitParams,
  start: JulianDate,
  steps = 360
): SampledPositionProperty => {
  const position = new SampledPositionProperty();

  for (let deg = 0; deg <= 360; deg += 360 / steps) {
    const time = JulianDate.addSeconds(start, deg, new JulianDate());
    const pos = toECI(deg, orbit);
    position.addSample(time, pos);
  }

  return position;
};

const hexToCesiumColor = (hex: string): Color => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return new Color(r, g, b);
};

export const SatellitesEntities = () => {
  const [entities, setEntities] = useState<any[]>([]);
  const start = JulianDate.now();

  useEffect(() => {
    const loadSatellites = async () => {
      const sats = await Promise.all(
        satelliteData.map(async (sat) => {
          const orbitParams: OrbitParams = {
            semiMajorAxis: sat.orbit.semiMajorAxis,
            eccentricity: sat.orbit.eccentricity,
            inclination: CesiumMath.toRadians(sat.orbit.inclination),
            raan: CesiumMath.toRadians(sat.orbit.raan),
            argOfPeriapsis: CesiumMath.toRadians(sat.orbit.argOfPeriapsis),
          };

          const position = createSampledPosition(orbitParams, start);
          const color = hexToCesiumColor(sat.pathColor || "#00ffff");
          const resource = await IonResource.fromAssetId(sat.modelAssetId);

          return {
            id: sat.id,
            name: sat.name,
            position,
            description: `
              <div class="satellite-info">
                <style>
                  .satellite-info {
                    color: black !important;
                    background-color: white !important;
                    font-family: sans-serif;
                    font-size: 14px;
                    line-height: 1.5;
                  }
                  .satellite-info strong {
                    color: #111;
                  }
                </style>
                <strong>${sat.name}</strong><br/>
                Frequencies: ${sat.frequencies?.join(", ") ?? "N/A"}<br/>
                ${sat.description}
              </div>`,
            path: {
              resolution: 1,
              material: color,
              width: sat.pathWidth ?? 1,
              leadTime: Number.POSITIVE_INFINITY,
              trailTime: Number.POSITIVE_INFINITY,
            },
            model: {
              uri: resource,
              scale: sat.modelScale ?? 1,
            },
            point: {
              pixelSize: 8,
              color: Color.WHITE,
              outlineColor: Color.BLACK,
              outlineWidth: 1,
            },
          };
        })
      );

      setEntities(sats);
    };

    loadSatellites();
  }, []);

  console.log("Satellites loaded:", entities);
  return (
    <>
      {entities.map((props) => (
        <Entity key={props.id} {...props} />
      ))}
    </>
  );
};