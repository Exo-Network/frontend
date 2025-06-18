import { useWalletStore } from "@/store/useWalletStore";
import {
  Box,
  Flex,
  Menu,
  Portal,
  Separator,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { FaUserAstronaut } from "react-icons/fa";
import { GiHamburgerMenu, GiSatelliteCommunication } from "react-icons/gi";
import { GrSatellite } from "react-icons/gr";
import { MdOutlineSatelliteAlt } from "react-icons/md";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import UserMenuItem from "./UserMenuItem";

const UserMenu = () => {
  const address = useWalletStore((state) => state.walletAddress) || "";
  const disconnectWallet = useWalletStore((s) => s.disconnectWallet);
  const navigate = useNavigate();
  const logout = () => {
    navigate("/");
    disconnectWallet();
  };
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Flex  zIndex={120}>
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
              borderRadius="md"
              bgColor={"blue.900"}
              transition="border-color 0.3s ease, box-shadow 0.3s ease"
              justify={"center"}
              alignItems={"center"}
              gap={1}
              color={"#B7C9EF"}
              _hover={{
                bgColor: "blue.800",
              }}
            >
              <Box
                borderWidth={"2px"}
                borderRadius={"lg"}
                borderColor="white"
                p="1"
                m="1"
              >
                <GiHamburgerMenu size="25px" />
              </Box>

            </Flex>
          </Flex>
        </Flex>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <UserMenuItem
              title="Ground Stations"
              path="/ground-stations"
              icon={<GrSatellite />}
            />
            <Separator />
            <UserMenuItem
              title="Spacecraft"
              path="/spacecraft"
              icon={<MdOutlineSatelliteAlt />}
            />
            <Separator />
            <UserMenuItem
              title="Controls"
              path="/cesium"
              icon={<GiSatelliteCommunication />}
            />
            <Separator />
            <UserMenuItem
              title="Account"
              path="/account"
              icon={<FaUserAstronaut />}
            />
            <Separator />
            <UserMenuItem
              title="Logout"
              path="/"
              icon={<RiLogoutCircleRFill />}
              color="red"
              onClick={logout}
            />
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default UserMenu;
