import { HStack, Menu, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

interface UserMenuItemProps {
  title: string;
  path: string;
  icon: React.ReactNode;
  onClick?: () => void;
  color?: string;
}

const UserMenuItem: React.FC<UserMenuItemProps> = ({ title, path, icon, onClick, color }) => {
  return (
    <Menu.Item
      _hover={{ cursor: "pointer", backgroundColor: "gray.700" }}
      fontSize="lg"
      value="export"
      onClick={onClick}
    >
      <RouterLink to={path} style={{ color: color || 'white', textDecoration: "none" }}>
        <HStack>
          {icon}
          <Text>{title}</Text>
        </HStack>
      </RouterLink>
    </Menu.Item>
  );
};

export default UserMenuItem;
