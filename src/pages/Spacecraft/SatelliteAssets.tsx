import { hexToCesiumColor } from "@/cesium/utils/SatelliteLoader";
import { useSatelliteStore } from "@/store/useSatelliteStore";
import * as Cesium from "@cesium/engine";

import { Satellite } from "@/store/useSatelliteStore";
import {
  Box,
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Cartesian3, Color } from "cesium";
import { useState } from "react";
import { FaCog } from "react-icons/fa";
import { CameraFlyTo, Entity, ImageryLayer, Viewer } from "resium";
import AddSatelliteDialog from "./addSatelliteDialog";
import EditSatelliteDialog from "./EditSatelliteDialog";

const SatelliteList = ({
  selectedSatellite,
  setSelectedSatellite,
}: {
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
      h="full"
      display="flex"
      flexDirection="column"
    >
      <Flex justify={"space-between"}>
        <Box fontWeight="bold" fontSize="lg">
          Satellites
        </Box>
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
              <Box
                as="span"
                px={2}
                py={1}
                bg="blue.500"
                color="white"
                borderRadius="md"
                fontSize="sm"
                fontWeight="bold"
                mr={2}
              >
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

const SatelliteDetails = ({
  selectedSatellite,
}: {
  selectedSatellite: Satellite | null;
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Get the latest satellite data from the store to ensure we have the most current version
  const getSatellite = useSatelliteStore((state) => state.getSatellite);
  const currentSatellite = selectedSatellite
    ? getSatellite(selectedSatellite.id)
    : null;

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
      h="full"
      overflow="hidden"
      maxH="full"
    >
      <Box w="full" h="full" p={4} overflow="auto" maxH="full">
        {currentSatellite ? (
          <VStack align="start" gap={1} w="full">
            <HStack justify="space-between" w="full">
              <VStack align="start" flex="1" gap={1}>
                <Text fontWeight="bold" fontSize="xl">
                  {currentSatellite.name}
                </Text>
                <Text fontSize="sm" color="gray.300">
                  {currentSatellite.description ?? "No description available."}
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
            <Text fontWeight="semibold" mt={1}>
              Orbit Parameters (TLE):
            </Text>
            <Text fontSize="sm">
              • TLE Line 1: {currentSatellite.tle?.line1 ?? "N/A"}
            </Text>
            <Text fontSize="sm">
              • TLE Line 2: {currentSatellite.tle?.line2 ?? "N/A"}
            </Text>
            <Text fontWeight="semibold" mt={1}>
              Frequencies:
            </Text>
            <Text fontSize="sm">
              {currentSatellite.frequencies?.join(", ") ?? "N/A"}
            </Text>
            <Text fontWeight="semibold" mt={1}>
              Additional Properties:
            </Text>
            <Text fontSize="sm">
              • Path Color: {currentSatellite.pathColor}
            </Text>
            <Text fontSize="sm">
              • Model Scale: {currentSatellite.modelScale}
            </Text>
            <Text fontSize="sm">
              • Master Range: {currentSatellite.masterRange} m
            </Text>
            <Text fontSize="sm">
              • Is Master: {currentSatellite.isMaster ? "Yes" : "No"}
            </Text>
          </VStack>
        ) : (
          <Text>No satellite selected</Text>
        )}
      </Box>
      <Box borderRadius={"xl"} overflow="hidden" h="full" maxH="full">
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
            imageryProvider={Cesium.TileMapServiceImageryProvider.fromUrl(
              "/cesium/NaturalEarthII",
              {
                maximumLevel: 5,
                credit: "Imagery courtesy Natural Earth",
              }
            )}
          />
          {currentSatellite && (
            <CameraFlyTo
              duration={2}
              destination={Cartesian3.fromDegrees(0, 0, 10000000)}
            />
          )}
          {currentSatellite && (
            <Entity
              key={`${currentSatellite.id}-${currentSatellite.pathColor}-${currentSatellite.modelScale}`}
              name={currentSatellite.name}
              position={currentSatellite.position}
              path={{
                resolution: 1,
                material: hexToCesiumColor(currentSatellite.pathColor),
                width: 2,
                leadTime: Number.POSITIVE_INFINITY,
                trailTime: Number.POSITIVE_INFINITY,
              }}
              point={{
                pixelSize: 8,
                color: hexToCesiumColor(currentSatellite.pathColor),
                outlineColor: Color.BLACK,
                outlineWidth: 1,
              }}
            />
          )}
        </Viewer>
      </Box>
      {currentSatellite && (
        <EditSatelliteDialog
          satellite={currentSatellite}
          isOpen={isEditDialogOpen}
          onClose={handleEditClose}
        />
      )}
    </Box>
  );
};

const SatelliteAssets = () => {
  const satellites = useSatelliteStore((state) => state.satellites);
  const satelliteList = Array.from(satellites.values());
  const [selectedSatellite, setSelectedSatellite] = useState(
    satelliteList.length > 0 ? satelliteList[0] : null
  );

  return (
    <Flex direction="column" h="full" overflow="hidden">
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={8}
        flex="1"
        h="full"
        overflow="hidden"
      >
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
