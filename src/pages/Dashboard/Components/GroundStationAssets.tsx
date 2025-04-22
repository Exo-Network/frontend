import {
  Dialog,
  Flex,
  Button,
  SimpleGrid,
  Box,
  Portal,
  CloseButton,
} from "@chakra-ui/react";

const GroundStationAssets = () => (
  <>
    <Dialog.Root>
      <Flex justify="flex" mb={4}>
        <Dialog.Trigger asChild>
          <Button colorScheme="green">+ Add Ground Station</Button>
        </Dialog.Trigger>
      </Flex>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create Ground Station</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button>Save</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
      {/* Placeholder asset cards */}
      <Box p={4} borderWidth="1px" borderRadius="md">
        Ground Station A
      </Box>
      <Box p={4} borderWidth="1px" borderRadius="md">
        Ground Station B
      </Box>
    </SimpleGrid>
  </>
);

export default GroundStationAssets;
