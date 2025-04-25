import { useUxStore } from "@/store/useUxStore";
import { useWalletStore } from "@/store/useWalletStore";
import { Button, Flex, Heading, HStack, Image, Spacer } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import UserMenu from "./Components/UserMenu";

export const SIDEBAR = {
  EXPANDED_WIDTH: 280,
  COLLAPSED_WIDTH: 88,
};

const TopBar = () => {
  const address = useWalletStore((state) => state.walletAddress);
  const isLoggedIn = address !== null;
  const setLoginDialogOpen = useUxStore((state) => state.setLoginDialogOpen);

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
              DecentSpace
            </Heading>
          </HStack>
        </RouterLink>
      </Flex>
      <Spacer w="full" />
      {isLoggedIn ? (
        <UserMenu />
      ) : (
        <Button onClick={()=>setLoginDialogOpen(true)}>Login</Button>
      )}
    </Flex>
  );
};

export default TopBar;
