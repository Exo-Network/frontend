import { Rectangle, SingleTileImageryProvider } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { ImageryLayer, Viewer } from "resium";
import { GroundStations } from "./utils/GroundStationLoader";
import { SatellitesEntities } from "./utils/SatelliteLoader";

export const CesiumViewer = () => {
  const offline = true;
  return (
      <Viewer style={{ height: "100%", width: "100%" }}>
        {offline && (
          <ImageryLayer
            imageryProvider={
              new SingleTileImageryProvider({
                url: "/cesium/natural-earth-2.jpg", // Path relative to public/
                rectangle: Rectangle.fromDegrees(-180, -90, 180, 90),
                tileWidth: 1008,
                tileHeight: 504,
              })
            }
          />
        )}
        <GroundStations />
        <SatellitesEntities />
      </Viewer>
  );
};
