import { hexToCesiumColor } from "@/cesium/utils/SatelliteLoader";
import { useSatelliteStore } from "@/store/useSatelliteStore";
import { Box, Flex, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {
  Cartesian3,
  Color,
  Rectangle,
  SingleTileImageryProvider,
} from "cesium";
import { useState } from "react";
import { CameraFlyTo, Entity, ImageryLayer, Viewer } from "resium";
import AddSatelliteDialog from "./addSatelliteDialog";

const SatelliteAssets = () => {
  const satellites = useSatelliteStore((state) => state.satellites);
  const satelliteList = Array.from(satellites.values());
  const [selectedSatellite, setSelectedSatellite] = useState(
    satelliteList.length > 0 ? satelliteList[0] : null
  );

  return (
    <Flex direction="column" h="100vh">
      <Flex direction={{ base: "column", md: "row" }} gap={8} flex="1">
        <Box w={{ base: "100%", md: "50%" }}>
          <AddSatelliteDialog />
          <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} gap={4}>
            {satelliteList.map((sat) => (
              <Box
                key={sat.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                cursor="pointer"
                bg={selectedSatellite?.id === sat.id ? "gray.700" : "gray.800"}
                color="white"
                borderColor={
                  selectedSatellite?.id === sat.id ? "green.400" : "gray.600"
                }
                onClick={() => setSelectedSatellite(sat)}
              >
                {sat.name}
              </Box>
            ))}
          </SimpleGrid>
        </Box>
        <Box
          w={{ base: "100%", md: "50%" }}
          p={4}
          borderWidth="1px"
          borderRadius="md"
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gap={4}
        >
          <Box>
            {selectedSatellite ? (
              <HStack justify="space-between" mb={4}>
                <VStack align="start">
                  <Text fontWeight="bold" fontSize="xl" mb={2}>
                    {selectedSatellite.name}
                  </Text>
                  <Text mb={2}>
                    {selectedSatellite.description ??
                      "No description available."}
                  </Text>
                  <Text fontWeight="semibold">Orbit Parameters:</Text>
                  <Text>
                    • Semi-major axis:{" "}
                    {selectedSatellite.orbit?.semiMajorAxis ?? "N/A"} m
                  </Text>
                  <Text>
                    • Eccentricity:{" "}
                    {selectedSatellite.orbit?.eccentricity ?? "N/A"}
                  </Text>
                  <Text>
                    • Inclination:{" "}
                    {selectedSatellite.orbit?.inclination ?? "N/A"}°
                  </Text>
                  <Text>• RAAN: {selectedSatellite.orbit?.raan ?? "N/A"}°</Text>
                  <Text>
                    • Argument of Periapsis:{" "}
                    {selectedSatellite.orbit?.argOfPeriapsis ?? "N/A"}°
                  </Text>
                  <Text fontWeight="semibold" mt={4}>
                    Frequencies:
                  </Text>
                  <Text>
                    {selectedSatellite.frequencies?.join(", ") ?? "N/A"}
                  </Text>
                </VStack>
              </HStack>
            ) : (
              <Text>No satellite selected</Text>
            )}
          </Box>
          <Box>
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
              {selectedSatellite && (
                <CameraFlyTo
                  duration={2}
                  destination={Cartesian3.fromDegrees(
                    (selectedSatellite.orbit?.raan ?? 0) * 2,
                    (selectedSatellite.orbit?.inclination ?? 0) * 2,
                    (selectedSatellite.orbit?.semiMajorAxis || 0) * 2
                  )}
                />
              )}
              {selectedSatellite && (
                <Entity
                  key={1}
                  name={selectedSatellite.name}
                  position={selectedSatellite.position}
                  path={{
                    resolution: 1,
                    material: hexToCesiumColor(selectedSatellite.pathColor),
                    width: 2,
                    leadTime: Number.POSITIVE_INFINITY,
                    trailTime: Number.POSITIVE_INFINITY,
                  }}
                  point={{
                    pixelSize: 8,
                    color: hexToCesiumColor(selectedSatellite.pathColor),
                    outlineColor: Color.BLACK,
                    outlineWidth: 1,
                  }}
                />
              )}
            </Viewer>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default SatelliteAssets;
