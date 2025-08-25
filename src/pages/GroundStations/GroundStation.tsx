import { useGroundStationStore } from "@/store/useGroundStationStore";
import { Box, Flex, HStack, Heading } from "@chakra-ui/react";
import { useState } from "react";
import GroundStationDetails from "./Components/GroundStationDetails";
import GroundStationList from "./Components/GroundStationList";
import { RefreshButton } from "@/components/ui/RefreshButton";

export const GroundStationPage = () => {
  const groundStations = Array.from(
    useGroundStationStore((state) => state.stations).values()
  );
  const [selectedStation, setSelectedStation] = useState(groundStations[0]);
  return (
    <Box p={4} h="calc(100vh - 80px)" overflow="hidden" maxH="calc(100vh - 80px)">
      <Flex direction="column" h="full" overflow="hidden">
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">Ground Stations</Heading>
          <RefreshButton variant="groundStations" />
        </HStack>
        <Flex direction={{ base: "column", md: "row" }} gap={8} flex="1" h="full" overflow="hidden">
          <GroundStationList
            selectedStation={selectedStation}
            setSelectedStation={setSelectedStation}
          />
          <GroundStationDetails selectedStation={selectedStation} />
        </Flex>
      </Flex>
    </Box>
  );
};
