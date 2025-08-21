import { Box, Flex } from "@chakra-ui/react";
import SatelliteAssets from "./SatelliteAssets";

export const SpacecraftPage = () => {
  return (
    <Box p={4} h="calc(100vh - 80px)" overflow="hidden" maxH="calc(100vh - 80px)">
      <Flex direction="column" h="full" overflow="hidden">
        <SatelliteAssets />
      </Flex>
    </Box>
  );
};
