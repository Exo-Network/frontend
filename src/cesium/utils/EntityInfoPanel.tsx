import { Box, Text, VStack, HStack, Badge, Button } from "@chakra-ui/react";
import { useGroundStationStore } from "@/store/useGroundStationStore";
import { useSatelliteStore } from "@/store/useSatelliteStore";
import { FaTimes, FaEdit } from "react-icons/fa";
import { useState } from "react";
import EditGroundStationDialog from "@/pages/GroundStations/Components/EditGroundStationDialog";
import EditSatelliteDialog from "@/pages/Spacecraft/EditSatelliteDialog";

export const EntityInfoPanel = () => {
  const selectedSatelliteId = useSatelliteStore((state) => state.selectedSatelliteId);
  const selectedGroundStationId = useGroundStationStore((state) => state.selectedGroundStationId);
  const getSatellite = useSatelliteStore((state) => state.getSatellite);
  const getGroundStation = useGroundStationStore((state) => state.getStation);
  const setSelectedSatellite = useSatelliteStore((state) => state.setSelectedSatellite);
  const setSelectedGroundStation = useGroundStationStore((state) => state.setSelectedGroundStation);
  
  const [isEditGroundStationOpen, setIsEditGroundStationOpen] = useState(false);
  const [isEditSatelliteOpen, setIsEditSatelliteOpen] = useState(false);

  const selectedSatellite = selectedSatelliteId ? getSatellite(selectedSatelliteId) : null;
  const selectedGroundStation = selectedGroundStationId ? getGroundStation(selectedGroundStationId) : null;

  const handleClose = () => {
    setSelectedSatellite(null);
    setSelectedGroundStation(null);
  };

  const handleEditGroundStation = () => {
    setIsEditGroundStationOpen(true);
  };

  const handleEditSatellite = () => {
    setIsEditSatelliteOpen(true);
  };

  if (!selectedSatellite && !selectedGroundStation) {
    return null;
  }

  return (
    <>
      <Box
        position="absolute"
        top="20px"
        right="20px"
        bg="rgba(0, 0, 0, 0.8)"
        color="white"
        p={4}
        borderRadius="md"
        maxW="400px"
        zIndex={1000}
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor="gray.600"
      >
        <HStack justify="space-between" mb={3}>
          <Text fontSize="lg" fontWeight="bold">
            {selectedSatellite ? "Satellite" : "Ground Station"}
          </Text>
          <Button
            size="sm"
            variant="ghost"
            color="white"
            onClick={handleClose}
            _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
          >
            <FaTimes />
          </Button>
        </HStack>

        {selectedSatellite && (
          <VStack align="start" gap={2}>
            <Text fontWeight="semibold" fontSize="md">
              {selectedSatellite.name}
            </Text>
            {selectedSatellite.description && (
              <Text fontSize="sm" color="gray.300">
                {selectedSatellite.description}
              </Text>
            )}
            <HStack gap={2}>
              <Text fontSize="sm" fontWeight="semibold">
                Frequencies:
              </Text>
              <HStack gap={1}>
                {selectedSatellite.frequencies.map((freq, index) => (
                  <Badge key={index} colorScheme="blue" size="sm">
                    {freq}
                  </Badge>
                ))}
              </HStack>
            </HStack>
            {selectedSatellite.isMaster && (
              <HStack gap={2}>
                <Text fontSize="sm" fontWeight="semibold">
                  Master Range:
                </Text>
                <Text fontSize="sm">
                  {selectedSatellite.masterRange.toLocaleString()} m
                </Text>
              </HStack>
            )}
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleEditSatellite}
              w="full"
            >
              <FaEdit style={{ marginRight: '8px' }} />
              Edit Satellite
            </Button>
          </VStack>
        )}

        {selectedGroundStation && (
          <VStack align="start" gap={2}>
            <Text fontWeight="semibold" fontSize="md">
              {selectedGroundStation.name}
            </Text>
            <Text fontSize="sm" color="gray.300">
              {selectedGroundStation.description}
            </Text>
            <HStack gap={2}>
              <Text fontSize="sm" fontWeight="semibold">
                Owner:
              </Text>
              <Text fontSize="sm">{selectedGroundStation.owner}</Text>
            </HStack>
            <HStack gap={2}>
              <Text fontSize="sm" fontWeight="semibold">
                Frequencies:
              </Text>
              <HStack gap={1}>
                {selectedGroundStation.frequencies.map((freq, index) => (
                  <Badge key={index} colorScheme="green" size="sm">
                    {freq}
                  </Badge>
                ))}
              </HStack>
            </HStack>
            <HStack gap={2}>
              <Text fontSize="sm" fontWeight="semibold">
                Cost per MB:
              </Text>
              <Text fontSize="sm">${selectedGroundStation.costPerMb.toFixed(2)}</Text>
            </HStack>
            <HStack gap={2}>
              <Text fontSize="sm" fontWeight="semibold">
                Position:
              </Text>
              <VStack gap={0} align="start">
                <Text fontSize="xs">Lat: {selectedGroundStation.latitude.toFixed(4)}°</Text>
                <Text fontSize="xs">Lon: {selectedGroundStation.longitude.toFixed(4)}°</Text>
                <Text fontSize="xs">Alt: {selectedGroundStation.altitude.toFixed(0)} m</Text>
              </VStack>
            </HStack>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleEditGroundStation}
              w="full"
            >
              <FaEdit style={{ marginRight: '8px' }} />
              Edit Ground Station
            </Button>
          </VStack>
        )}
      </Box>

      {/* Edit Dialogs */}
      {selectedGroundStation && (
        <EditGroundStationDialog
          groundStation={selectedGroundStation}
          isOpen={isEditGroundStationOpen}
          onClose={() => setIsEditGroundStationOpen(false)}
        />
      )}

      {selectedSatellite && (
        <EditSatelliteDialog
          satellite={selectedSatellite}
          isOpen={isEditSatelliteOpen}
          onClose={() => setIsEditSatelliteOpen(false)}
        />
      )}
    </>
  );
};
