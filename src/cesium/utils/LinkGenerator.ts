import { Color, SampledPositionProperty } from "cesium";
import { Satellite, SatelliteDataGenerator } from "./SatelliteDataGenerator";
import { GroundStation, GroundStationDataGenerator } from "./GroundStationDataGenerator";

export interface Link {
  satelliteId: string;
  stationId: string;
  color: Color;
  position: SampledPositionProperty;
}

export class LinkGenerator {
  private satelliteGenerator: SatelliteDataGenerator;
  private groundStationGenerator: GroundStationDataGenerator;
  private links: Link[] = [];

  constructor() {
    this.satelliteGenerator = new SatelliteDataGenerator();
    this.groundStationGenerator = new GroundStationDataGenerator();
    this.generateLinks();
  }

  private generateLinks() {
    const satellites = this.satelliteGenerator.getAllSatellites();
    const stations = this.groundStationGenerator.getAllStations();

    satellites.forEach(satellite => {
      stations.forEach(station => {
        // Check for common frequencies
        const commonFrequencies = satellite.frequencies.filter(freq => 
          station.frequencies.includes(freq)
        );

        if (commonFrequencies.length > 0) {
          this.links.push({
            satelliteId: satellite.id,
            stationId: station.id,
            color: Color.fromCssColorString(satellite.pathColor),
            position: satellite.position
          });
        }
      });
    });
  }

  public getLinks(): Link[] {
    return this.links;
  }

  public updateSatellitePosition(satelliteId: string, position: SampledPositionProperty) {
    this.satelliteGenerator.updateSatellitePosition(satelliteId, position);
    // Regenerate links when satellite position updates
    this.generateLinks();
  }
} 