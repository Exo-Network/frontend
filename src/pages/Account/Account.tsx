import { useWalletStore } from "@/store/useWalletStore";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Link,
  Stack,
  Stat,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FaBuilding,
  FaCheckCircle,
  FaCoins,
  FaGlobe,
  FaHistory,
  FaRocket,
  FaSatellite,
} from "react-icons/fa";
import { SiSolana } from "react-icons/si";

const Account = () => {
  const address = useWalletStore((state) => state.walletAddress) || "";

  // Mock data for demonstration
  // const balance = "0.00";
  const solBalance = "1.5";
  const gstBalance = "1000";
  const transactions = [
    {
      id: 1,
      type: "Received",
      amount: "0.5",
      from: "0x1234...5678",
      timestamp: "2024-03-20 14:30",
    },
    {
      id: 2,
      type: "Sent",
      amount: "0.2",
      to: "0x8765...4321",
      timestamp: "2024-03-19 09:15",
    },
  ];

  // Mock company data
  const companyData = {
    name: "SpaceTech Solutions",
    country: "United States",
    isVerified: true,
    role: "Administrator",
    spacecraftCount: 5,
    groundStationsCount: 3,
  };

  // Mock financial data
  const financialData = {
    expenses: {
      daily: { amount: "50", value: "$100" },
      monthly: { amount: "1500", value: "$3000" },
    },
    benefits: {
      daily: { amount: "75", value: "$150" },
      monthly: { amount: "2250", value: "$4500" },
    },
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Blockchain Info Section */}
        <Card.Root>
          <Card.Header>
            <HStack>
              <SiSolana />
              <Heading size="md">Blockchain Information</Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <VStack gap={4} align="stretch">
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Wallet Address
                </Text>
                <Link
                  href={`https://explorer.solana.com/address/${address}`}
                  target="_blank"
                  color="blue.400"
                >
                  <Text fontSize="lg" fontFamily="mono">
                    {address}
                  </Text>
                </Link>
              </Box>
              <HStack justify="space-between">
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    SOL Balance
                  </Text>
                  <Text fontSize="xl" fontWeight="bold">
                    {solBalance} SOL
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    GST Balance
                  </Text>
                  <Text fontSize="xl" fontWeight="bold">
                    {gstBalance} GST
                  </Text>
                </Box>
                <Button colorScheme="blue" size="sm">
                  Add GST
                </Button>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Company Information */}
        <Card.Root>
          <Card.Header>
            <HStack>
              <FaBuilding />
              <Heading size="md">Company Information</Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <VStack gap={4} align="stretch">
              <HStack>
                <Text fontSize="lg" fontWeight="bold">
                  {companyData.name}
                </Text>
                {companyData.isVerified && (
                  <Badge colorScheme="green">
                    <FaCheckCircle />
                    Verified
                  </Badge>
                )}
              </HStack>
              <HStack>
                <FaGlobe />
                <Text>{companyData.country}</Text>
              </HStack>
              <Text>Role: {companyData.role}</Text>
              <HStack gap={8}>
                <HStack>
                  <FaRocket />
                  <Text>{companyData.spacecraftCount} Spacecraft</Text>
                </HStack>
                <HStack>
                  <FaSatellite />
                  <Text>{companyData.groundStationsCount} Ground Stations</Text>
                </HStack>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Financial Metrics */}
        <Card.Root>
          <Card.Header>
            <HStack>
              <FaCoins />
              <Heading size="md">Financial Metrics</Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <Stack direction={{ base: "column", md: "row" }} gap={8}>
              {/* Expenses */}
              <Box flex="1">
                <Heading size="sm" mb={4}>
                  Expenses
                </Heading>
                <VStack gap={4} align="stretch">
                  <Stat.Root>
                    <Stat.Label>Daily</Stat.Label>
                    <Stat.ValueText>
                      {financialData.expenses.daily.amount} GST
                    </Stat.ValueText>
                    <Text fontSize="sm" color="gray.500">
                      {financialData.expenses.daily.value}
                    </Text>
                  </Stat.Root>
                  <Stat.Root>
                    <Stat.Label>Monthly</Stat.Label>
                    <Stat.ValueText>
                      {financialData.expenses.monthly.amount} GST
                    </Stat.ValueText>
                    <Text fontSize="sm" color="gray.500">
                      {financialData.expenses.monthly.value}
                    </Text>
                  </Stat.Root>
                </VStack>
              </Box>
              {/* Benefits */}
              <Box flex="1">
                <Heading size="sm" mb={4}>
                  Benefits
                </Heading>
                <VStack gap={4} align="stretch">
                  <Stat.Root>
                    <Stat.Label>Daily</Stat.Label>
                    <Stat.ValueText>
                      {financialData.benefits.daily.amount} GST
                    </Stat.ValueText>
                    <Text fontSize="sm" color="gray.500">
                      {financialData.benefits.daily.value}
                    </Text>
                  </Stat.Root>
                  <Stat.Root>
                    <Stat.Label>Monthly</Stat.Label>
                    <Stat.ValueText>
                      {financialData.benefits.monthly.amount} GST
                    </Stat.ValueText>
                    <Text fontSize="sm" color="gray.500">
                      {financialData.benefits.monthly.value}
                    </Text>
                  </Stat.Root>
                </VStack>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Transaction History Section */}
        <Card.Root>
          <Card.Header>
            <HStack>
              <FaHistory />
              <Heading size="md">Transaction History</Heading>
            </HStack>
          </Card.Header>
          <Card.Body>
            <Box overflowX="auto">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px" }}>Type</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>
                      Amount
                    </th>
                    <th style={{ textAlign: "left", padding: "8px" }}>
                      From/To
                    </th>
                    <th style={{ textAlign: "left", padding: "8px" }}>
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ padding: "8px" }}>
                        <Badge
                          colorScheme={tx.type === "Received" ? "green" : "red"}
                        >
                          {tx.type}
                        </Badge>
                      </td>
                      <td style={{ padding: "8px" }}>{tx.amount} ETH</td>
                      <td style={{ padding: "8px" }}>
                        {tx.type === "Received" ? tx.from : tx.to}
                      </td>
                      <td style={{ padding: "8px" }}>{tx.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Container>
  );
};

export default Account;
