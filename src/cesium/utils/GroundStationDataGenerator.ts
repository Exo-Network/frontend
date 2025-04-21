import { Cartesian3 } from "cesium";
import stationData from "../data/groundStations.json";

export interface GroundStation {
  id: string;
  name: string;
  frequencies: string[];
  position: Cartesian3;
  color: string;
}

export class GroundStationDataGenerator {
  private stations: Map<string, GroundStation> = new Map();

  constructor() {
    this.initializeStations();
  }

  private initializeStations() {
    stationData.forEach(station => {
      const position = Cartesian3.fromDegrees(
        station.lon,
        station.lat,
        station.alt || 0
      );
      
      this.stations.set(station.id, {
        id: station.id,
        name: station.name,
        frequencies: station.frequencies,
        position,
        color: station.color
      });
    });
  }

  public getStation(id: string): GroundStation | undefined {
    return this.stations.get(id);
  }

  public getAllStations(): GroundStation[] {
    return Array.from(this.stations.values());
  }
} 