import {
  Button,
  CloseButton,
  Dialog,
  Input,
  Portal,
  Textarea,
  Stack,
  Checkbox,
  Box,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FrequencyType, GroundStation, useGroundStationStore } from "@/store/useGroundStationStore";

interface EditGroundStationDialogProps {
  groundStation: GroundStation;
  isOpen: boolean;
  onClose: () => void;
}

const EditGroundStationDialog = ({ groundStation, isOpen, onClose }: EditGroundStationDialogProps) => {
  const updateStation = useGroundStationStore((state) => state.updateStation);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    longitude: "",
    latitude: "",
    altitude: "",
    frequencies: [] as FrequencyType[],
    color: "",
    owner: "",
    costPerMb: "",
    description: "",
    onchain: false,
  });

  // Update form data when ground station prop changes
  useEffect(() => {
    if (groundStation) {
      setFormData({
        id: groundStation.id,
        name: groundStation.name,
        longitude: groundStation.longitude.toString(),
        latitude: groundStation.latitude.toString(),
        altitude: groundStation.altitude.toString(),
        frequencies: groundStation.frequencies,
        color: groundStation.color,
        owner: groundStation.owner,
        costPerMb: groundStation.costPerMb.toString(),
        description: groundStation.description,
        onchain: groundStation.onchain,
      });
    }
  }, [groundStation]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFrequencyChange = (frequency: FrequencyType, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      frequencies: checked
        ? [...prev.frequencies, frequency]
        : prev.frequencies.filter((f) => f !== frequency),
    }));
  };

  const handleSubmit = () => {
    try {
      updateStation(groundStation.id, {
        name: formData.name,
        longitude: parseFloat(formData.longitude) || 0,
        latitude: parseFloat(formData.latitude) || 0,
        altitude: parseFloat(formData.altitude) || 0,
        frequencies: formData.frequencies,
        color: formData.color,
        owner: formData.owner,
        costPerMb: parseFloat(formData.costPerMb) || 0,
        description: formData.description,
        onchain: formData.onchain,
      });
      onClose();
    } catch (err) {
      console.error("Error updating ground station:", err);
    }
  };

  return (
    <Dialog.Root lazyMount open={isOpen} onOpenChange={() => onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            bg="gray.800"
            border="1px solid"
            borderColor="gray.600"
            borderRadius="md"
            boxShadow="xl"
            maxW="2xl"
          >
            <Dialog.Header
              bg="gray.700"
              borderBottom="1px solid"
              borderColor="gray.600"
              px={6}
              py={4}
            >
              <Dialog.Title color="white" fontSize="xl" fontWeight="semibold">
                Edit Ground Station: {groundStation.name}
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" color="white" onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body bg="gray.800" px={6} py={4}>
              <VStack gap={4} align="stretch">
                <Box>
                  <Text color="white" fontWeight="medium" mb={2}>
                    Name
                  </Text>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    bg="gray.700"
                    borderColor="gray.500"
                    color="white"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                    _placeholder={{ color: "gray.400" }}
                  />
                </Box>
                <Box>
                  <Text color="white" fontWeight="medium" mb={2}>
                    Longitude
                  </Text>
                  <Input
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleChange}
                    bg="gray.700"
                    borderColor="gray.500"
                    color="white"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                    _placeholder={{ color: "gray.400" }}
                  />
                </Box>
                <Box>
                  <Text color="white" fontWeight="medium" mb={2}>
                    Latitude
                  </Text>
                  <Input
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleChange}
                    bg="gray.700"
                    borderColor="gray.500"
                    color="white"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                    _placeholder={{ color: "gray.400" }}
                  />
                </Box>
                <Box>
                  <Text color="white" fontWeight="medium" mb={2}>
                    Altitude (m)
                  </Text>
                  <Input
                    name="altitude"
                    type="number"
                    step="any"
                    value={formData.altitude}
                    onChange={handleChange}
                    bg="gray.700"
                    borderColor="gray.500"
                    color="white"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                    _placeholder={{ color: "gray.400" }}
                  />
                </Box>
                <Box>
                  <Text color="white" fontWeight="medium" mb={2}>
                    Color
                  </Text>
                  <Input
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={handleChange}
                    bg="gray.700"
                    borderColor="gray.500"
                    color="white"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                    h="40px"
                  />
                </Box>
                <Box>
                  <Text color="white" fontWeight="medium" mb={2}>
                    Owner
                  </Text>
                  <Input
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    bg="gray.700"
                    borderColor="gray.500"
                    color="white"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                    _placeholder={{ color: "gray.400" }}
                  />
                </Box>
                <Box>
                  <Text color="white" fontWeight="medium" mb={2}>
                    Cost per MB ($)
                  </Text>
                  <Input
                    name="costPerMb"
                    type="number"
                    step="0.01"
                    value={formData.costPerMb}
                    onChange={handleChange}
                    bg="gray.700"
                    borderColor="gray.500"
                    color="white"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                    _placeholder={{ color: "gray.400" }}
                  />
                </Box>
                <Box>
                  <Text color="white" fontWeight="medium" mb={2}>
                    Frequencies
                  </Text>
                  <VStack gap={2} align="start">
                    {Object.values(FrequencyType).map((frequency) => (
                      <HStack key={frequency} gap={2}>
                        <input
                          type="checkbox"
                          checked={formData.frequencies.includes(frequency)}
                          onChange={(e) => handleFrequencyChange(frequency, e.target.checked)}
                          style={{ accentColor: '#3182ce' }}
                        />
                        <Text color="white">
                          {frequency}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
                <Box>
                  <Text color="white" fontWeight="medium" mb={2}>
                    On-chain
                  </Text>
                  <HStack gap={2}>
                    <input
                      type="checkbox"
                      checked={formData.onchain}
                      onChange={(e) => setFormData(prev => ({ ...prev, onchain: e.target.checked }))}
                      style={{ accentColor: '#38a169' }}
                    />
                    <Text color="white">
                      This station is on-chain
                    </Text>
                  </HStack>
                </Box>
                <Box>
                  <Text color="white" fontWeight="medium" mb={2}>
                    Description
                  </Text>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    bg="gray.700"
                    borderColor="gray.500"
                    color="white"
                    _hover={{ borderColor: "gray.400" }}
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                    _placeholder={{ color: "gray.400" }}
                    resize="vertical"
                  />
                </Box>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer
              bg="gray.700"
              borderTop="1px solid"
              borderColor="gray.600"
              px={6}
              py={4}
            >
              <Button variant="outline" color="white" borderColor="gray.500" _hover={{ bg: "gray.600" }} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleSubmit} ml={3}>
                Save Changes
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default EditGroundStationDialog;
