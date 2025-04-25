import { useUxStore } from "@/store/useUxStore";
import { useWalletStore } from "@/store/useWalletStore";
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

const LoginDialog = () => {
  const loginDialogOpen = useUxStore((state) => state.loginDialogOpen);
  const setLoginDialogOpen = useUxStore((state) => state.setLoginDialogOpen);

  const connectWallet = useWalletStore((s) => s.connectWallet);

  const [isloading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await connectWallet();
      //wait 2seconds
    } finally {
      setLoading(false);
      setLoginDialogOpen(false);
    }
  };

  return (
    <Dialog.Root
      lazyMount
      open={loginDialogOpen}
      onOpenChange={(e) => setLoginDialogOpen(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Login</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {/* //Spinne when loading */}
              <Text fontSize="lg" mb={4}>
                Connect your wallet to access the full features of the app.
              </Text>
              {isloading && <Spinner size="lg" color="purple.500" />}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>

              <Button
                variant="outline"
                colorScheme="purple"
                size="sm"
                onClick={handleConnect}
                loadingText="Connecting"
              >
                Login with Phantom
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default LoginDialog;
