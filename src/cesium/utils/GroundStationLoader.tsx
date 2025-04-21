import { Cartesian3, Color } from "cesium";
import { Entity } from "resium";
import stationData from "../data/groundStations.json";
import { Key } from "react";

export const GroundStations = () => {
  return (
    <>
      {stationData.map(
        (station: {
          lon: number;
          lat: number;
          alt: number | undefined;
          id: Key | null | undefined;
          name: string | undefined;
          color: string;
          owner: any;
          frequencies: any[];
          costPerMb: number;
          description: any;
        }) => {
          const position = Cartesian3.fromDegrees(
            station.lon,
            station.lat,
            station.alt
          );

          return (
            <Entity
              key={station.id}
              name={station.name}
              position={position}
              point={{
                pixelSize: 10,
                color: Color.fromCssColorString(station.color),
                outlineColor: Color.BLACK,
                outlineWidth: 1,
              }}
              label={{
                text: station.name,
                font: "14px sans-serif",
                style: 2,
                verticalOrigin: 1,
                pixelOffset: new Cartesian3(0, -20, 0),
              }}
              description={`<div style="color: black">
                <strong style="color: black">${station.name}</strong><br/>
                <span style="color: black">Owner:</span> ${station.owner}<br/>
                <span style="color: black">Frequencies:</span> ${station.frequencies.join(
                  ", "
                )}<br/>
                <span style="color: black">Cost per MB:</span> $${station.costPerMb.toFixed(
                  2
                )}<br/>
                <span style="color: black">${station.description}</span>
              </div>`}
            />
          );
        }
      )}
    </>
  );
};
