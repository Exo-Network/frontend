import { Box, Heading } from "@chakra-ui/react";
import SatelliteAssets from "./SatelliteAssets";

export const SpacecraftPage = () => {
  return (
    <Box p={6}>
      <Heading mb={4}>Spacecraft</Heading>
      <SatelliteAssets />
    </Box>
  );
};
