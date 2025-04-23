import { Box, Heading } from "@chakra-ui/react";
import GroundStationAssets from "./GroundStationAssets";

export const GroundStationPage = () => {
  return (
    <Box p={6}>
      <Heading mb={4}>Ground Stations</Heading>

      <GroundStationAssets />
    </Box>
  );
};
