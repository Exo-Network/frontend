import {
    Cartesian3,
    Color,
    Entity,
    IonResource,
    JulianDate,
    Math as CesiumMath,
    Matrix3,
    SampledPositionProperty,
    Viewer
  } from 'cesium'
  import satelliteData from '../data/satellites.json'
  
  type OrbitParams = {
    semiMajorAxis: number
    eccentricity: number
    inclination: number
    raan: number
    argOfPeriapsis: number
  }
  
  export class SatelliteLoader {
    viewer: Viewer
    start: JulianDate = JulianDate.now()
    totalOrbits: number = 1
    stepDegrees: number = 1
    simulationDuration: number
  
    constructor(viewer: Viewer, start: JulianDate, durationSeconds: number) {
        this.viewer = viewer
        this.start = start
        this.simulationDuration = durationSeconds
      }
  
    private toECI(angleDeg: number, orbit: OrbitParams): Cartesian3 {
      const ν = CesiumMath.toRadians(angleDeg)
      const a = orbit.semiMajorAxis
      const e = orbit.eccentricity
  
      // Compute radius r from orbit equation
      const r = (a * (1 - e * e)) / (1 + e * Math.cos(ν))
  
      // Position in the orbital plane (Perifocal coordinates)
      const xOrb = r * Math.cos(ν)
      const yOrb = r * Math.sin(ν)
      const zOrb = 0
  
      const perifocal = new Cartesian3(xOrb, yOrb, zOrb)
  
      // Convert angles to radians
      const i = CesiumMath.toRadians(orbit.inclination)
      const Ω = CesiumMath.toRadians(orbit.raan)
      const ω = CesiumMath.toRadians(orbit.argOfPeriapsis)
  
      // Build rotation matrices
      const Rz_RAAN = Matrix3.fromRotationZ(Ω, new Matrix3())
      const Rx_Inc = Matrix3.fromRotationX(i, new Matrix3())
      const Rz_ArgPeriapsis = Matrix3.fromRotationZ(ω, new Matrix3())
  
      // Total rotation: R = Rz(Ω) * Rx(i) * Rz(ω)
      const rotation = Matrix3.multiply(Rz_RAAN, Matrix3.multiply(Rx_Inc, Rz_ArgPeriapsis, new Matrix3()), new Matrix3())
  
      // Apply rotation
      return Matrix3.multiplyByVector(rotation, perifocal, new Cartesian3())
    }
  
    private createSampledPosition(orbit: OrbitParams): SampledPositionProperty {
      const position = new SampledPositionProperty()
  
      for (let orbitCount = 0; orbitCount < this.totalOrbits; orbitCount++) {
        for (let deg = 0; deg <= 360; deg += this.stepDegrees) {
          const time = JulianDate.addSeconds(this.start, deg + orbitCount * 360, new JulianDate())
          const pos = this.toECI(deg, orbit)
          position.addSample(time, pos)
        }
      }
  
      return position
    }
  
    private hexToCesiumColor(hex: string): Color {
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255
      return new Color(r, g, b)
    }
  
    async loadAllSatellites(): Promise<Entity[]> {
      const entities: Entity[] = []
  
      for (const sat of satelliteData) {
        const position = this.createSampledPosition(sat.orbit)
        const color = this.hexToCesiumColor(sat.pathColor)
        const resource = await IonResource.fromAssetId(sat.modelAssetId)
  
        const entity = this.viewer.entities.add({
          id: sat.id,
          name: sat.name,
          description: sat.description,
          position,
          path: {
            resolution: 1,
            material: color,
            width: sat.pathWidth,
            leadTime: Number.POSITIVE_INFINITY,
            trailTime: Number.POSITIVE_INFINITY
          },
          model: {
            uri: resource,
            scale: sat.modelScale
          },
          point: {
            pixelSize: 8,
            color: Color.WHITE,
            outlineColor: Color.BLACK,
            outlineWidth: 1
          }
        })
  
        entities.push(entity)
      }
  
      return entities
    }
  }