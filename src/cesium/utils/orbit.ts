import { Cartesian3, JulianDate, Matrix3, Math as CesiumMath, SampledPositionProperty, LagrangePolynomialApproximation } from "cesium";

export type OrbitParams = {
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

  const i = CesiumMath.toRadians(orbit.inclination);
  const Ω = CesiumMath.toRadians(orbit.raan);
  const ω = CesiumMath.toRadians(orbit.argOfPeriapsis);

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

export const createSampledPosition = (
  orbit: OrbitParams,
  start: JulianDate,
  steps = 360,
  loop = false
): SampledPositionProperty => {
  const position = new SampledPositionProperty();

  for (let deg = 0; deg <= 360; deg += 360 / steps) {
    const time = JulianDate.addSeconds(start, deg, new JulianDate());
    const pos = toECI(deg, orbit);
    position.addSample(time, pos);
  }

  if (loop) {
    position.setInterpolationOptions({
      interpolationDegree: 5,
      interpolationAlgorithm: LagrangePolynomialApproximation,
    });
  }

  return position;
};