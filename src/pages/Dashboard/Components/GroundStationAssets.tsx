import { GroundStations } from "@/cesium/utils/GroundStationLoader";
import { useGroundStationStore } from "@/store/useGroundStationStore";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  HStack,
  Portal,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Rectangle, SingleTileImageryProvider } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useState } from "react";
import { ImageryLayer, Viewer } from "resium";

const GroundStationAssets = () => {
  const groundStations = Array.from(
    useGroundStationStore((state) => state.stations).values()
  );
  const [selectedStation, setSelectedStation] = useState(
    groundStations.length > 0 ? groundStations[0] : null
  );

  return (
    <Flex direction="column" h="100vh">
      <Flex direction={{ base: "column", md: "row" }} gap={8} flex="1">
        <Box w={{ base: "100%", md: "50%" }}>
          <Dialog.Root>
            <Flex justify="flex-end" mb={4}>
              <Dialog.Trigger asChild>
                <Button colorScheme="green">+ Add Ground Station</Button>
              </Dialog.Trigger>
            </Flex>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Create Ground Station</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button>Save</Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} gap={4}>
            {groundStations.map((station) => (
              <Box
                key={station.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                cursor="pointer"
                bg={
                  selectedStation?.id === station.id ? "gray.700" : "gray.800"
                }
                color="white"
                borderColor={
                  selectedStation?.id === station.id ? "green.400" : "gray.600"
                }
                onClick={() => setSelectedStation(station)}
              >
                {station.name}
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Box
          w={{ base: "100%", md: "50%" }}
          p={4}
          borderWidth="1px"
          borderRadius="md"
          minH="100px"
          display="flex"
          flexDir="column"
        >
          {selectedStation ? (
            <HStack justify="space-between" mb={4}>
              <VStack align="start">
                <Text fontWeight="bold" fontSize="xl" mb={2}>
                  {selectedStation.name}
                </Text>
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
          <Viewer
            style={{ flex: 1 }}
            animation={false}
            timeline={false}
            baseLayerPicker={false}
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
            <GroundStations />
          </Viewer>
        </Box>
      </Flex>
    </Flex>
  );
};

export default GroundStationAssets;
