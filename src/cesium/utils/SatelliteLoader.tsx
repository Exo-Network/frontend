import { useSatelliteStore } from "@/store/useSatelliteStore";
import { Cartesian3, Math as CesiumMath, Color, Matrix3 } from "cesium";
import { Entity } from "resium";

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

export const hexToCesiumColor = (hex: string): Color => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return new Color(r, g, b);
};

export const SatellitesEntities = () => {
  const satellites = useSatelliteStore((state) => state.satellites);

  return (
    <>
      {Array.from(satellites.values()).map((sat) => (
        <Entity
          key={sat.id}
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
          description={`<div style="color: black">
            <strong>${sat.name}</strong><br/>
            Frequencies: ${sat.frequencies.join(", ")}
          </div>`}
        />
      ))}
    </>
  );
};
