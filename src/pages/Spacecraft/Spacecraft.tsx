import { Box, Flex, HStack, Heading } from "@chakra-ui/react";
import SatelliteAssets from "./SatelliteAssets";
import { RefreshButton } from "@/components/ui/RefreshButton";

export const SpacecraftPage = () => {
  return (
    <Box p={4} h="calc(100vh - 80px)" overflow="hidden" maxH="calc(100vh - 80px)">
      <Flex direction="column" h="full" overflow="hidden">
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">Satellites</Heading>
          <RefreshButton variant="satellites" />
        </HStack>
        <SatelliteAssets />
      </Flex>
    </Box>
  );
};
