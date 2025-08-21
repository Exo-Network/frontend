import { useGroundStationStore } from "@/store/useGroundStationStore";
import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import GroundStationDetails from "./Components/GroundStationDetails";
import GroundStationList from "./Components/GroundStationList";

export const GroundStationPage = () => {
  const groundStations = Array.from(
    useGroundStationStore((state) => state.stations).values()
  );
  const [selectedStation, setSelectedStation] = useState(groundStations[0]);
  return (
    <Box p={4} h="calc(100vh - 80px)" overflow="hidden" maxH="calc(100vh - 80px)">
      <Flex direction="column" h="full" overflow="hidden">
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
