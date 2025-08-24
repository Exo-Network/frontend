import { Cartesian3, Color } from "cesium";
import { Entity } from "resium";
import { useGroundStationStore, GroundStation } from "@/store/useGroundStationStore";

export const GroundStations = () => {
  const GroundStationsStore = Array.from(useGroundStationStore((state) => state.stations).values());

  
  return (
    <>
      {GroundStationsStore.map((station: GroundStation) => {
          const position = station.cartesianPosition;

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
                style: 1,
                verticalOrigin: 1,
                pixelOffset: new Cartesian3(0, -20, 0),
              }}
              description={`<div style="color: white; padding: 15px; background: rgba(0,0,0,0.8); border-radius: 8px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 10px 0; color: #4CAF50; border-bottom: 2px solid #4CAF50; padding-bottom: 5px;">${station.name}</h3>
                <p style="margin: 5px 0;"><strong style="color: #FFD700;">Owner:</strong> ${station.owner}</p>
                <p style="margin: 5px 0;"><strong style="color: #FFD700;">Frequencies:</strong> ${station.frequencies.join(", ")}</p>
                <p style="margin: 5px 0;"><strong style="color: #FFD700;">Cost per MB:</strong> $${station.costPerMb.toFixed(2)}</p>
                <p style="margin: 5px 0; font-style: italic; color: #E0E0E0;">${station.description}</p>
              </div>`}
            />
          );
        }
      )}
    </>
  );
};
