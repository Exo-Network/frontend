import { hexToCesiumColor } from "@/cesium/utils/SatelliteLoader";
import { useSatelliteStore } from "@/store/useSatelliteStore";
import { Box, Flex, HStack, SimpleGrid, Text, VStack, Tag, TagLabel } from "@chakra-ui/react";
import {
  Cartesian3,
  Color,
  Rectangle,
  SingleTileImageryProvider,
} from "cesium";
import { useState } from "react";
import { CameraFlyTo, Entity, ImageryLayer, Viewer } from "resium";
import AddSatelliteDialog from "./addSatelliteDialog";
import { Satellite } from "@/store/useSatelliteStore";

const SatelliteList = ({ selectedSatellite, setSelectedSatellite }: {
  selectedSatellite: Satellite | null;
  setSelectedSatellite: (sat: Satellite) => void;
}) => {
  const satellites = useSatelliteStore((state) => state.satellites);
  const satelliteList = Array.from(satellites.values());
  return (
    <Box
      w={{ base: "100%", md: "30%" }}
      borderWidth="1px"
      borderRadius="md"
      p={4}
      maxH="85vh"
      display="flex"
      flexDirection="column"
    >
      <Flex justify={"space-between"}>
        <Box fontWeight="bold" fontSize="lg">Satellites</Box>
        <AddSatelliteDialog />
      </Flex>
      <Box flex="1" overflowY="auto" mt={4}>
        <SimpleGrid columns={{ base: 1, md: 1, lg: 1 }} gap={4}>
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
              <Box as="span" px={2} py={1} bg="blue.500" color="white" borderRadius="md" fontSize="sm" fontWeight="bold" mr={2}>
                SAT
              </Box>
              {sat.name}
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

const SatelliteDetails = ({ selectedSatellite }: { selectedSatellite: Satellite | null }) => (
  <Box
    w={{ base: "100%", md: "70%" }}
    p={4}
    borderWidth="1px"
    borderRadius="md"
    display="grid"
    gridTemplateColumns="1fr 1fr"
    gap={4}
    maxH="85vh"
    overflowY="auto"
  >
    <Box>
      {selectedSatellite ? (
        <HStack justify="space-between" mb={4} align="start">
          <VStack align="start">
            <Text fontWeight="bold" fontSize="xl" mb={2}>
              {selectedSatellite.name}
            </Text>
            <Text mb={2}>
              {selectedSatellite.description ?? "No description available."}
            </Text>
            <Text fontWeight="semibold">Orbit Parameters:</Text>
            <Text>
              • Semi-major axis: {selectedSatellite.orbit?.semiMajorAxis ?? "N/A"} m
            </Text>
            <Text>
              • Eccentricity: {selectedSatellite.orbit?.eccentricity ?? "N/A"}
            </Text>
            <Text>
              • Inclination: {selectedSatellite.orbit?.inclination ?? "N/A"}°
            </Text>
            <Text>• RAAN: {selectedSatellite.orbit?.raan ?? "N/A"}°</Text>
            <Text>
              • Argument of Periapsis: {selectedSatellite.orbit?.argOfPeriapsis ?? "N/A"}°
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
              (selectedSatellite.orbit?.semiMajorAxis || 0) * 3
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
);

const SatelliteAssets = () => {
  const satellites = useSatelliteStore((state) => state.satellites);
  const satelliteList = Array.from(satellites.values());
  const [selectedSatellite, setSelectedSatellite] = useState(
    satelliteList.length > 0 ? satelliteList[0] : null
  );

  return (
    <Flex direction="column">
      <Flex direction={{ base: "column", md: "row" }} gap={8} flex="1">
        <SatelliteList
          selectedSatellite={selectedSatellite}
          setSelectedSatellite={setSelectedSatellite}
        />
        <SatelliteDetails selectedSatellite={selectedSatellite} />
      </Flex>
    </Flex>
  );
};

export default SatelliteAssets;
