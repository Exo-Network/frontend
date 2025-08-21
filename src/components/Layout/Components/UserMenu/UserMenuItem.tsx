import { HStack, Menu, Text, Box } from "@chakra-ui/react";
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
      _hover={{ 
        cursor: "pointer", 
        backgroundColor: "gray.700",
        transform: "translateX(2px)"
      }}
      fontSize="md"
      fontWeight="medium"
      py={3}
      px={4}
      transition="all 0.2s ease"
      value="export"
      onClick={onClick}
      bg="transparent"
    >
      <RouterLink to={path} style={{ color: color || 'white', textDecoration: "none", width: '100%' }}>
        <HStack gap={3}>
          <Box color={color || "blue.300"}>
            {icon}
          </Box>
          <Text color={color || "white"}>{title}</Text>
        </HStack>
      </RouterLink>
    </Menu.Item>
  );
};

export default UserMenuItem;
