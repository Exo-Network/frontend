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
  Button,
} from "@chakra-ui/react";
import { Cartesian3, Rectangle, SingleTileImageryProvider } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { FaCog } from "react-icons/fa";
import { CameraFlyTo, ImageryLayer, Viewer } from "resium";
import { useState } from "react";
import EditGroundStationDialog from "./EditGroundStationDialog";

const GroundStationDetails = ({
  selectedStation,
}: {
  selectedStation: GroundStation;
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };

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
      <Box w="full" h="full" p={4}>
        {selectedStation ? (
          <VStack align="start" gap={1} w="full">
            <HStack justify="space-between" w="full">
              <VStack align="start" flex="1" gap={1}>
                <Text fontWeight="bold" fontSize="xl">
                  {selectedStation.name}
                </Text>
                <Text fontSize="sm" color="gray.300">
                  {selectedStation.description}
                </Text>
              </VStack>
              <Button
                colorScheme="blue"
                size="md"
                variant="solid"
                onClick={() => setIsEditDialogOpen(true)}
                _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                transition="all 0.2s ease"
                px={4}
                py={2}
                borderRadius="md"
                boxShadow="md"
              >
                <FaCog size="16px" />
              </Button>
            </HStack>

            <Text fontWeight="semibold" mt={1}>Owner:</Text>
            <Text fontSize="sm">{selectedStation.owner}</Text>
            <Text fontWeight="semibold" mt={1}>Frequencies:</Text>
            <Text fontSize="sm">{selectedStation.frequencies.join(", ")}</Text>
            <Text fontWeight="semibold" mt={1}>Cost per MB:</Text>
            <Text fontSize="sm">${selectedStation.costPerMb.toFixed(2)}</Text>
            <Text fontWeight="semibold" mt={1}>Position:</Text>
            <VStack gap={0} align="start">
              <Text fontSize="sm">Latitude: {selectedStation.latitude}</Text>
              <Text fontSize="sm">Longitude: {selectedStation.longitude}</Text>
              <Text fontSize="sm">Altitude: {selectedStation.altitude}</Text>
            </VStack>
          </VStack>
        ) : (
          <Text>No station selected</Text>
        )}
      </Box>
      <Box borderRadius={"xl"} overflow="hidden" h="full">
        <Viewer
          style={{ height: "100%", width: "100%" }}
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
      {selectedStation && (
        <EditGroundStationDialog
          groundStation={selectedStation}
          isOpen={isEditDialogOpen}
          onClose={handleEditClose}
        />
      )}
    </Box>
  );
};

export default GroundStationDetails;
