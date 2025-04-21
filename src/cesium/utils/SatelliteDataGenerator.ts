import { Cartesian3, SampledPositionProperty } from "cesium";
import satelliteData from "../data/satellites.json";

export interface Satellite {
  id: string;
  name: string;
  frequencies: string[];
  position: SampledPositionProperty;
  pathColor: string;
}

export class SatelliteDataGenerator {
  private satellites: Map<string, Satellite> = new Map();

  constructor() {
    this.initializeSatellites();
  }

  private initializeSatellites() {
    satelliteData.forEach(sat => {
      this.satellites.set(sat.id, {
        id: sat.id,
        name: sat.name,
        frequencies: sat.frequencies,
        position: new SampledPositionProperty(),
        pathColor: sat.pathColor || "#00ffff"
      });
    });
  }

  public getSatellite(id: string): Satellite | undefined {
    return this.satellites.get(id);
  }

  public getAllSatellites(): Satellite[] {
    return Array.from(this.satellites.values());
  }

  public updateSatellitePosition(id: string, position: SampledPositionProperty) {
    const satellite = this.satellites.get(id);
    if (satellite) {
      satellite.position = position;
    }
  }
} 