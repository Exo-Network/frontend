import { Button, HStack } from "@chakra-ui/react";

import { useColorMode } from "./components/ui/color-mode";

function App() {
  const { toggleColorMode } = useColorMode();

  return (
    <>
      <HStack>
        <Button>Click me</Button>
        <Button onClick={toggleColorMode}>
          Toggle Mode
        </Button>{" "}
      </HStack>
    </>
  );
}

export default App;
