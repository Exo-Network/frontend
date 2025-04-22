import { Box, Flex, Heading, HStack, Image, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Flex direction="column" minH="100vh">
      <Flex
        as="header"
        h="80px"
        bg="black"
        color="white"
        px={5}
        align="center"
        justify="space-between"
      >
        <RouterLink to="/" style={{ textDecoration: "none", color: "white" }}>
          <HStack gap={3}>
            <Image src="/exonet.svg" alt="ExoNet logo" h="40px" />
            <Heading size="md" m={0}>
              DecentSpace
            </Heading>
          </HStack>
        </RouterLink>

        <HStack gap={4}>
          <RouterLink
            to="/dashboard"
            style={{ color: "white", textDecoration: "none" }}
          >
            <Text
              fontSize="md"
              fontWeight="bold"
              _hover={{ textDecoration: "underline" }}
            >
              My Assets
            </Text>
          </RouterLink>
          <RouterLink
            to="/cesium"
            style={{ color: "white", textDecoration: "none" }}
          >
            <Text
              fontSize="md"
              fontWeight="bold"
              _hover={{ textDecoration: "underline" }}
            >
              Viewer
            </Text>
          </RouterLink>
        </HStack>
      </Flex>

      <Box as="main" flex="1" display="flex" flexDirection="column">
        {children}
      </Box>
    </Flex>
  );
};
