import { useWalletStore } from "@/store/useWalletStore";
import {
  Avatar,
  Button,
  CloseButton,
  Dialog,
  Link,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

export const WalletButton = () => {
  const walletAddress = useWalletStore((s) => s.walletAddress);
  const connectWallet = useWalletStore((s) => s.connectWallet);
  const disconnectWallet = useWalletStore((s) => s.disconnectWallet);
  const balance = useWalletStore((s) => s.balance);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await connectWallet();
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress) {
    return (
      <Button
        variant="outline"
        colorScheme="teal"
        size="sm"
        onClick={handleConnect}
        loading={loading}
        loadingText="Connecting"
      >
        Login
      </Button>
    );
  }

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          colorScheme="teal"
          maxW={"150px"}
          alignItems="center"
          justifyContent="start"
          gap={6}
        >
          <Avatar.Root colorPalette="red" bgColor={"gray.700"} mx="-4">
            <Avatar.Fallback />
            <Avatar.Image src="https://bit.ly/broken-link" />
          </Avatar.Root>
          My Account
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Wallet Info</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack align="start" gap={3}>
                <Text fontWeight="semibold">Address:</Text>

                <Link
                  href={`https://explorer.solana.com/address/${walletAddress}`}
                  color="blue.500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text wordBreak="break-word">{walletAddress}</Text>{" "}
                </Link>
                <Text fontWeight="semibold">
                  Balance:{" "}
                  {balance !== null
                    ? `${balance.toFixed(4)} SOL`
                    : "Unavailable"}
                </Text>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button colorScheme="red" onClick={disconnectWallet}>
                Disconnect
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
