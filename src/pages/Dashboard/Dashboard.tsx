import {
  Box,
  Flex,
  Heading,
  Tabs,
  SimpleGrid,
  Button,
  Input,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import SatelliteAssets from "./Components/SatelliteAssets";
import GroundStationAssets from "./Components/GroundStationAssets";

export const DashboardPage = () => {
  return (
    <Box p={6}>
      <Heading mb={4}>My Assets</Heading>
      <Tabs.Root defaultValue="satellites" variant="enclosed">
        <Tabs.List>
          <Tabs.Trigger value="satellites">Satellites</Tabs.Trigger>
          <Tabs.Trigger value="groundstations">Ground Stations</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="satellites">
          <SatelliteAssets />
        </Tabs.Content>
        <Tabs.Content value="groundstations">
          <GroundStationAssets />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};
