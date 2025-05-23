import "cesium/Build/Cesium/Widgets/widgets.css";
import { Viewer } from "resium";
import { GroundStations } from "./utils/GroundStationLoader";
import {SatellitesEntities} from "./utils/SatelliteLoader";

export const CesiumViewer = () => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Viewer style={{ height: '100%', width: '100%' }}>
         <GroundStations />
         <SatellitesEntities />
      </Viewer>
    </div>
  );
};
