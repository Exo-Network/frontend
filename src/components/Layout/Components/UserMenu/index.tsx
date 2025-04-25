import { useWalletStore } from "@/store/useWalletStore";
import { Avatar, Flex, Menu, Portal, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";



const UserMenu = () => {
  const address = useWalletStore((state) => state.walletAddress) || '';
  const disconnectWallet = useWalletStore((s) => s.disconnectWallet);

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Flex display={address ? "flex" : "none"} zIndex={120}>
          <Flex
            align="center"
            cursor="pointer"
            pr="1px"
            role="group"
            transition="opacity 0.3s ease-in-out"
          >
            <Flex
              border="4px"
              borderColor="brand.main"
              m="2"
              px="2"
              borderRadius="md"
              bgColor={"gray.800"}
              // Add transition to borderColor and boxShadow for smooth effect
              transition="border-color 0.3s ease, box-shadow 0.3s ease"
              justify={"center"}
              alignItems={"center"}
              gap={5}
            >
              <Avatar.Root colorPalette="red" bgColor={"gray.700"} mx="-4">
                <Avatar.Fallback />
                <Avatar.Image src="https://bit.ly/broken-link" />
              </Avatar.Root>
              <Text fontSize="lg" fontWeight="bold">
                {address.slice(0, 6) + "..." + address.slice(-4)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item
              _hover={{ cursor: "pointer", backgroundColor: "gray.700" }}
              fontSize="lg"
              value="new-txt"
            >
              <RouterLink
                to="/ground-stations"
                style={{ color: "white", textDecoration: "none" }}
              >
                Ground Stations
              </RouterLink>
            </Menu.Item>
            <Menu.Item
              _hover={{ cursor: "pointer", backgroundColor: "gray.700" }}
              fontSize="lg"
              value="new-file"
            >
              <RouterLink
                to="/spacecraft"
                style={{ color: "white", textDecoration: "none" }}
              >
                Satellites
              </RouterLink>
            </Menu.Item>
            <Menu.Item
              _hover={{ cursor: "pointer", backgroundColor: "gray.700" }}
              fontSize="lg"
              value="new-win"
            >
              {" "}
              <RouterLink
                to="/cesium"
                style={{ color: "white", textDecoration: "none" }}
              >
                Controls
              </RouterLink>
            </Menu.Item>
            <Menu.Item
              _hover={{ cursor: "pointer", backgroundColor: "gray.700" }}
              fontSize="lg"
              value="open-file"
            >
              Tokens
            </Menu.Item>
            <Menu.Item
              _hover={{ cursor: "pointer", backgroundColor: "gray.700" }}
              fontSize="lg"
              value="export"
            >
              Settings
            </Menu.Item>
            <Menu.Item
              _hover={{ cursor: "pointer", backgroundColor: "red.700" }}
              fontSize="lg"
              value="logout"
              onClick={disconnectWallet}
            >
              Logout
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default UserMenu;
