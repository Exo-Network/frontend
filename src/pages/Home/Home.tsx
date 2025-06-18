import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Badge,
  Grid,
  GridItem,
  VStack,
  HStack,
} from "@chakra-ui/react";
import LoginDialog from "./Component/LoginDialog";

export const Home = () => {

  return (
    <Box>
      <LoginDialog />
      {/* Hero Section */}
      <Flex
        as="section"
        direction={{ base: "column", md: "row" }}
        align="center"
        p="8"
        minH="80vh"
        bg="linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
        color="white"
      >
        <Box flex="1">
          <Badge colorScheme="green" mb="4" fontSize="md" px="3" py="1">
            Revolutionary Technology
          </Badge>
          <Heading as="h1" size="2xl" mb="4" lineHeight="1.2">
            TreeNet: Next-Generation
            <Text as="span" color="green.400"> Satellite Mesh Communication</Text>
          </Heading>
          <Text fontSize="xl" mb="6" opacity="0.9">
            Transform satellite communication with our innovative batch transmission technology. 
            Instead of individual connections, TreeNet enables secure, efficient packet delivery 
            through intelligent satellite mesh networks.
          </Text>
          <Stack direction={{ base: "column", sm: "row" }} gap="4">
            <Button colorScheme="green" size="lg" px="8">
              Explore TreeNet Demo
            </Button>
            <Button variant="outline" colorScheme="whiteAlpha" size="lg" px="8">
              Learn More
            </Button>
          </Stack>
        </Box>
        <Box flex="1" textAlign="center">
          <img
            src="/Earth-visu.png"
            alt="TreeNet Satellite Mesh Network"
            style={{ maxHeight: "400px", margin: "0 auto" }}
          />
        </Box>
      </Flex>

      {/* Key Benefits */}
      <Box as="section" p="12" bg="gray.50">
        <Box textAlign="center" mb="12">
          <Heading size="lg" mb="4">
            Why TreeNet is Revolutionary
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
            Traditional satellite communication requires individual ground station connections. 
            TreeNet changes everything with intelligent batch processing and mesh networking.
          </Text>
        </Box>
        
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="8" maxW="6xl" mx="auto">
          <GridItem>
            <VStack gap="4" p="6" bg="white" borderRadius="lg" shadow="md" h="full">
              <Box
                w="16"
                h="16"
                bg="green.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="2xl" fontWeight="bold" color="green.600">⚡</Text>
              </Box>
              <Heading size="md" textAlign="center">
                Batch Transmission
              </Heading>
              <Text textAlign="center" color="gray.600">
                Send packets to multiple satellites simultaneously instead of one-by-one connections, 
                dramatically reducing transmission time and ground station overhead.
              </Text>
            </VStack>
          </GridItem>
          
          <GridItem>
            <VStack gap="4" p="6" bg="white" borderRadius="lg" shadow="md" h="full">
              <Box
                w="16"
                h="16"
                bg="blue.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">🌐</Text>
              </Box>
              <Heading size="md" textAlign="center">
                Intelligent Mesh Network
              </Heading>
              <Text textAlign="center" color="gray.600">
                Satellites automatically forward messages to neighboring satellites, creating a 
                self-organizing mesh network that ensures global coverage and redundancy.
              </Text>
            </VStack>
          </GridItem>
          
          <GridItem>
            <VStack gap="4" p="6" bg="white" borderRadius="lg" shadow="md" h="full">
              <Box
                w="16"
                h="16"
                bg="purple.100"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">🔒</Text>
              </Box>
              <Heading size="md" textAlign="center">
                Secure & Reliable
              </Heading>
              <Text textAlign="center" color="gray.600">
                Advanced encryption and error correction ensure secure, reliable communication 
                even in challenging orbital conditions and network disruptions.
              </Text>
            </VStack>
          </GridItem>
        </Grid>
      </Box>

      {/* How TreeNet Works */}
      <Box as="section" p="12">
        <Box textAlign="center" mb="12">
          <Heading size="lg" mb="4">
            How TreeNet Works
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
            Our three-step process revolutionizes satellite communication infrastructure
          </Text>
        </Box>
        
        <Flex direction={{ base: "column", lg: "row" }} justify="space-around" align="center" maxW="6xl" mx="auto">
          <VStack gap="6" flex="1" p="6">
            <Box
              w="20"
              h="20"
              bg="green.500"
              color="white"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="2xl"
              fontWeight="bold"
            >
              1
            </Box>
            <Image
              src="/icons/register.svg"
              alt="Register Icon"
              boxSize="80px"
            />
            <VStack gap="2">
              <Heading size="md" textAlign="center">
                Register Network Nodes
              </Heading>
              <Text textAlign="center" color="gray.600" maxW="300px">
                Register your satellites and ground stations in the TreeNet ecosystem. 
                Each node becomes part of the intelligent mesh network.
              </Text>
            </VStack>
          </VStack>
          
          <VStack gap="6" flex="1" p="6">
            <Box
              w="20"
              h="20"
              bg="blue.500"
              color="white"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="2xl"
              fontWeight="bold"
            >
              2
            </Box>
            <Image
              src="/icons/schedule.png"
              alt="Batch Transmission Icon"
              boxSize="80px"
            />
            <VStack gap="2">
              <Heading size="md" textAlign="center">
                Batch Packet Transmission
              </Heading>
              <Text textAlign="center" color="gray.600" maxW="300px">
                Send data packets to multiple satellites simultaneously. 
                TreeNet optimizes transmission windows and routing paths automatically.
              </Text>
            </VStack>
          </VStack>
          
          <VStack gap="6" flex="1" p="6">
            <Box
              w="20"
              h="20"
              bg="purple.500"
              color="white"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="2xl"
              fontWeight="bold"
            >
              3
            </Box>
            <Image
              src="/icons/schedule.png"
              alt="Mesh Network Icon"
              boxSize="80px"
            />
            <VStack gap="2">
              <Heading size="md" textAlign="center">
                Mesh Network Distribution
              </Heading>
              <Text textAlign="center" color="gray.600" maxW="300px">
                Satellites automatically forward messages through the mesh network, 
                ensuring global coverage and optimal data delivery to all destinations.
              </Text>
            </VStack>
          </VStack>
        </Flex>
      </Box>

      {/* Call to Action */}
      <Box as="section" p="12" bg="green.600" color="white" textAlign="center">
        <VStack gap="6">
          <Heading size="lg">
            Ready to Experience the Future of Satellite Communication?
          </Heading>
          <Text fontSize="lg" maxW="2xl">
            Join the TreeNet revolution and discover how batch transmission and mesh networking 
            can transform your satellite operations.
          </Text>
          <HStack gap="4">
            <Button colorScheme="white" variant="outline" size="lg" px="8">
              Get Started
            </Button>
            <Button bg="white" color="green.600" size="lg" px="8" _hover={{ bg: "gray.100" }}>
              Contact Sales
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};
