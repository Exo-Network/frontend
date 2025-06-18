import {
  GroundStation,
  useGroundStationStore,
} from "@/store/useGroundStationStore";
import { Box, Checkbox, Flex, SimpleGrid, Tag } from "@chakra-ui/react";
import "cesium/Build/Cesium/Widgets/widgets.css";
import AddGroundStationDialog from "./addGroundStationDialog";
const GroundStationList = ({
  selectedStation,
  setSelectedStation,
}: {
  selectedStation: GroundStation;
  setSelectedStation: (station: GroundStation) => void;
}) => {
  const groundStations = Array.from(
    useGroundStationStore((state) => state.stations).values()
  );

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
        <Checkbox.Root defaultChecked>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Show Publics</Checkbox.Label>
        </Checkbox.Root>
        <AddGroundStationDialog />
      </Flex>
      <Box flex="1" overflowY="auto" mt={4}>
        <SimpleGrid columns={{ base: 1, md: 1, lg: 1 }} gap={4}>
          {groundStations.map((station) => (
            <Box
              key={station.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              cursor="pointer"
              bg={selectedStation?.id === station.id ? "gray.700" : "gray.800"}
              color="white"
              borderColor={
                selectedStation?.id === station.id ? "green.400" : "gray.600"
              }
              onClick={() => setSelectedStation(station)}
            >
              <Tag.Root
                size="sm"
                colorPalette={station.onchain == true ? "green" : "blue"}
                variant="solid"
                mr="2"
              >
                <Tag.Label>
                  {station.onchain == true ? "Public" : "Private"}
                </Tag.Label>
              </Tag.Root>
              {station.name}
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default GroundStationList;
