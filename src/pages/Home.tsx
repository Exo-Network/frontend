import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

export const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Flex
        as="section"
        direction={{ base: "column", md: "row" }}
        align="center"
        p="8"
      >
        <Box flex="1">
          <Heading as="h1" size="2xl" mb="4">
            Decentralized Satellite–Ground Station Scheduler
          </Heading>
          <Text fontSize="lg" mb="6">
            Register your nodes, visualize coverage, and unlock orbital synergy.
          </Text>
          <Stack direction="row">
            <Button colorScheme="blue" size="lg">
              Explore Demo
            </Button>
            <Button variant="outline" size="lg">
              Connect Wallet
            </Button>
          </Stack>
        </Box>
        <Box flex="1" textAlign="center">
          <img
            src="/Earth-visu.png"
            alt="Earth visualization"
            style={{ maxHeight: "300px", margin: "0 auto" }}
          />
        </Box>
      </Flex>

      {/* How It Works */}
      <Box as="section" p="8">
        <Heading size="lg" mb="6">
          How It Works
        </Heading>
        <Flex justify="space-around">
          <Stack align="center">
            <Image
              src="/icons/register.svg"
              alt="Register Icon"
              boxSize="64px"
            />
            <Text>Register Satellite / Ground Station</Text>
          </Stack>
          <Stack align="center">
            <Image
              src="/icons/schedule.png"
              alt="Schedule Icon"
              boxSize="64px"
            />
            <Text>Set Availability & Visibility</Text>
          </Stack>
          <Stack align="center">
            <Image
              src="/icons/schedule.png"
              alt="Visualize Icon"
              boxSize="64px"
            />
            <Text>Schedule & Visualize Connections</Text>
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
};
