import { Cartesian3, Color } from "cesium";
import { Entity } from "resium";
import { useGroundStationStore, GroundStation } from "@/store/useGroundStationStore";

export const GroundStations = () => {
  const GroundStationsStore = Array.from(useGroundStationStore((state) => state.stations).values());

  
  return (
    <>
      {GroundStationsStore.map((station: GroundStation) => {
          const position = station.position;

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
