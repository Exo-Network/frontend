import { GroundStations } from "@/cesium/utils/GroundStationLoader";
import { GroundStation } from "@/store/useGroundStationStore";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Cartesian3, Rectangle, SingleTileImageryProvider } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { IoSettings } from "react-icons/io5";
import { CameraFlyTo, ImageryLayer, Viewer } from "resium";

const GroundStationDetails = ({
  selectedStation,
}: {
  selectedStation: GroundStation;
}) => {
  return (
    <Box
      w={{ base: "100%", md: "70%" }}
      p={4}
      borderWidth="1px"
      borderRadius="md"
      display="grid"
      gridTemplateColumns="1fr 1fr"
      gap={4}
    >
      <Box w="full" h="full" borderWidth="1px" borderRadius="md" p={4}>
        {selectedStation ? (
          <HStack justify="space-between" mb={4} w="full">
            <VStack align="start" w="full">
              <HStack mb={2} w="full">
                <Text fontWeight="bold" fontSize="xl" mb={2}>
                  {selectedStation.name}
                </Text>
                <Spacer />
                <IconButton aria-label="Search database">
                  <IoSettings />
                </IconButton>{" "}
              </HStack>

              <Text mb={2}>{selectedStation.description}</Text>
              <Text>
                <strong>Owner:</strong> {selectedStation.owner}
              </Text>
              <Text>
                <strong>Frequencies:</strong>{" "}
                {selectedStation.frequencies.join(", ")}
              </Text>
              <Text>
                <strong>Cost per MB:</strong> $
                {selectedStation.costPerMb.toFixed(2)}
              </Text>
              <Flex>
                <Text>Position:</Text>
                <VStack ml={2} gap={0} align={"start"}>
                  <Text>Latitude: {selectedStation.latitude}</Text>
                  <Text>Longitude: {selectedStation.longitude}</Text>
                  <Text>Altitude: {selectedStation.altitude}</Text>
                </VStack>
              </Flex>
            </VStack>
          </HStack>
        ) : (
          <Text>No station selected</Text>
        )}
      </Box>
      <Box borderRadius={"xl"} overflow="hidden">
        <Viewer
          style={{ height: "400px", width: "100%" }}
          timeline={false}
          animation={false}
          navigationHelpButton={false}
          homeButton={false}
          sceneModePicker={false}
          baseLayerPicker={false}
          geocoder={false}
          fullscreenButton={false}
          infoBox={false}
          selectionIndicator={false}
        >
          <ImageryLayer
            imageryProvider={
              new SingleTileImageryProvider({
                url: "/cesium/natural-earth-2.jpg",
                rectangle: Rectangle.fromDegrees(-180, -90, 180, 90),
                tileWidth: 1008,
                tileHeight: 504,
              })
            }
          />
          {selectedStation && (
            <CameraFlyTo
              duration={2}
              destination={Cartesian3.fromDegrees(
                selectedStation.longitude,
                selectedStation.latitude,
                selectedStation.altitude + 10000000
              )}
            />
          )}
          <GroundStations />
        </Viewer>
      </Box>
    </Box>
  );
};

export default GroundStationDetails;
