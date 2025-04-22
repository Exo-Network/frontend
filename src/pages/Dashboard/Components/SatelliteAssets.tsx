import { Dialog, Flex, Button, SimpleGrid, Box, Portal } from "@chakra-ui/react";

const SatelliteAssets = () => (
    <Dialog.Root>
      <Flex justify="flex" mb={4}>
        <Dialog.Trigger asChild>
          <Button colorScheme="blue">+ Add Satellite</Button>
        </Dialog.Trigger>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        <Box p={4} borderWidth="1px" borderRadius="md">Satellite 1</Box>
        <Box p={4} borderWidth="1px" borderRadius="md">Satellite 2</Box>
      </SimpleGrid>
      <Portal>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Add Satellite</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            {/* Satellite input fields go here */}
          </Dialog.Body>
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  );

export default SatelliteAssets;