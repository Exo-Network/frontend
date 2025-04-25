import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import TopBar from "./Topbar";

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
        <TopBar />
      </Flex>

      <Box
        as="main"
        flex="1"
        display="flex"
        flexDirection="column"
        bg={"gray.900"}
      >
        {children}
      </Box>
    </Flex>
  );
};
