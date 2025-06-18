import { Flex, Heading, HStack, Image, Spacer } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import UserMenu from "./Components/UserMenu/UserMenu";

export const SIDEBAR = {
  EXPANDED_WIDTH: 280,
  COLLAPSED_WIDTH: 88,
};

const TopBar = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/spacecraft":
        return "Spacecrafts";
      case "/ground-stations":
        return "Ground Stations";
      case "/account":
        return "Account";
      case "/cesium":
        return "Cesium";
      default:
        return "";
    }
  };

  return (
    <Flex
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
      pr={{ base: 4, lg: 12 }}
      height={{ base: 20, lg: 24 }}
      alignItems="center"
      bg={"black"}
      borderBottomWidth="2px"
      borderColor={"brand.main"}
      boxShadow="cyanGlow"
      transition="ease-in-out"
      transitionDuration=".3s"
      w="100%"
    >
      <Flex display={{ base: "none", md: "flex" }}>
        <RouterLink to="/" style={{ textDecoration: "none", color: "white" }}>
          <HStack gap={3}>
            <Image src="/exonet.svg" alt="ExoNet logo" h="40px" />
            <Heading size="md" m={0}>
              ExoNet
            </Heading>
          </HStack>
        </RouterLink>
      </Flex>
      <Spacer w="full" />
      <Heading size="3xl" color="white" textAlign="center" flexShrink={0}>
        {getPageTitle()}
      </Heading>
      <Spacer w="full" />
      <UserMenu />
    </Flex>
  );
};

export default TopBar;
