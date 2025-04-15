import {
  Cartesian3,
  Cartographic,
  Color,
  Ellipsoid,
  Entity,
  Viewer,
} from "cesium";
import stationData from "../data/groundStations.json";

export class GroundStationLoader {
  viewer: Viewer;

  constructor(viewer: Viewer) {
    this.viewer = viewer;
  }

  private hexToCesiumColor(hex: string): Color {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return new Color(r, g, b);
  }

  loadAllStations(): Entity[] {
    const entities: Entity[] = [];

    for (const station of stationData) {
      const carto = Cartographic.fromDegrees(
        station.lon,
        station.lat,
        station.alt
      );
      const position = Ellipsoid.WGS84.cartographicToCartesian(carto);

      const entity = this.viewer.entities.add({
        id: station.id,
        name: station.name,
        description: `
          <div class="station-info">
            <style>
              .station-info {
                color: black !important;
                background-color: white !important;
                font-family: sans-serif;
                font-size: 14px;
                line-height: 1.5;
              }
              .station-info a {
                color: #0077cc;
              }
              .station-info strong {
                color: #111;
              }
            </style>
            <strong>${station.name}</strong><br/>
            Owner: ${station.owner}<br/>
            Frequencies: ${station.frequencies.join(", ")}<br/>
            Cost per MB: $${station.costPerMb.toFixed(2)}<br/>
            ${station.description}
          </div>
        `,
        position,
        point: {
          pixelSize: 10,
          color: this.hexToCesiumColor(station.color),
          outlineColor: Color.BLACK,
          outlineWidth: 1,
        },
        label: {
          text: station.name,
          font: "14px sans-serif",
          style: 2,
          verticalOrigin: 1,
          pixelOffset: new Cartesian3(0, -20, 0),
        },
      });

      entities.push(entity);
    }

    return entities;
  }
}
