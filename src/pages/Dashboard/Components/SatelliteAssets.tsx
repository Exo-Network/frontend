import { useSatelliteStore } from "@/store/useSatelliteStore";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Portal,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

const SatelliteAssets = () => {
  const satellites = useSatelliteStore((state) => state.satellites);
  const satelliteList = Array.from(satellites.values());
  const [selectedSatellite, setSelectedSatellite] = useState(
    satelliteList.length > 0 ? satelliteList[0] : null
  );

  return (
    <Flex direction={{ base: "column", md: "row" }} gap={8}>
      <Box w={{ base: "100%", md: "50%" }}>
        <Dialog.Root>
          <Flex justify="flex-end" mb={4}>
            <Dialog.Trigger asChild>
              <Button colorScheme="green">+ Add Satellite</Button>
            </Dialog.Trigger>
          </Flex>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Create Satellite</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
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
      >
        {selectedSatellite ? (
          <>
            <Text fontWeight="bold" fontSize="xl" mb={2}>
              {selectedSatellite.name}
            </Text>
            <Text mb={2}>
              {selectedSatellite.description ?? "No description available."}
            </Text>
            <Text fontWeight="semibold" mt={4}>
              Orbit Parameters:
            </Text>
            <Text>
              • Semi-major axis:{" "}
              {selectedSatellite.orbit?.semiMajorAxis ?? "N/A"} m
            </Text>
            <Text>
              • Eccentricity: {selectedSatellite.orbit?.eccentricity ?? "N/A"}
            </Text>
            <Text>
              • Inclination: {selectedSatellite.orbit?.inclination ?? "N/A"}°
            </Text>
            <Text>• RAAN: {selectedSatellite.orbit?.raan ?? "N/A"}°</Text>
            <Text>
              • Argument of Periapsis:{" "}
              {selectedSatellite.orbit?.argOfPeriapsis ?? "N/A"}°
            </Text>
            <Text fontWeight="semibold" mt={4}>
              Frequencies:
            </Text>
            <Text>{selectedSatellite.frequencies?.join(", ") ?? "N/A"}</Text>
          </>
        ) : (
          <Text>No satellite selected</Text>
        )}
      </Box>
    </Flex>
  );
};

export default SatelliteAssets;
