import {
  Button,
  CloseButton,
  Dialog,
  Flex,
  Input,
  Portal,
  Textarea,
  Fieldset,
  Field,
  Stack,
  NativeSelect,
} from "@chakra-ui/react";
import { useState } from "react";
import { FrequencyType } from "@/store/useGroundStationStore";
import { useSatelliteStore } from "@/store/useSatelliteStore";
import { FaPlus } from "react-icons/fa";

const AddSatelliteDialog = () => {
  const [open, setOpen] = useState(false)
  const createSatellite = useSatelliteStore((state) => state.createSatellite);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    tleLine1: "",
    tleLine2: "",
    frequencies: FrequencyType.S,
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setFormData({
          id: json.id,
          name: json.name,
          tleLine1: json.tle?.line1 ?? "",
          tleLine2: json.tle?.line2 ?? "",
          frequencies: json.frequencies?.[0] ?? FrequencyType.S,
          description: json.description ?? "",
        });
      } catch (err) {
        console.error("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    try {
      createSatellite({
        id: formData.id || crypto.randomUUID(),
        name: formData.name,
        tle: {
          line1: formData.tleLine1,
          line2: formData.tleLine2,
        },
        frequencies: [formData.frequencies],
        description: formData.description,
      });
      setOpen(false);
    } catch (err) {}
  };

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Flex justify="flex-end" mb={4}>
        <Dialog.Trigger asChild>
          <Button 
            colorScheme="green" 
            size="md" 
            variant="solid"
            px={4}
            py={2}
            borderRadius="md"
            boxShadow="md"
            _hover={{ bg: "green.600", transform: "scale(1.05)" }}
            transition="all 0.2s ease"
          >
            <FaPlus size="16px" />
          </Button>
        </Dialog.Trigger>
      </Flex>
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
                Create Satellite
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" color="white" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body bg="gray.800" px={6} py={4}>
              <Fieldset.Root size="lg" maxW="md">
                <Fieldset.Content>
                  <Stack gap={4}>
                    <Field.Root>
                      <Field.Label color="white" fontWeight="medium">
                        Import from file
                      </Field.Label>
                      <Input 
                        type="file" 
                        accept=".json" 
                        onChange={handleFileUpload}
                        bg="gray.700"
                        borderColor="gray.500"
                        color="white"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label color="white" fontWeight="medium">
                        Name
                      </Field.Label>
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
                    </Field.Root>
                    <Field.Root>
                      <Field.Label color="white" fontWeight="medium">
                        TLE Line 1
                      </Field.Label>
                      <Input
                        name="tleLine1"
                        value={formData.tleLine1}
                        onChange={handleChange}
                        bg="gray.700"
                        borderColor="gray.500"
                        color="white"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                        _placeholder={{ color: "gray.400" }}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label color="white" fontWeight="medium">
                        TLE Line 2
                      </Field.Label>
                      <Input
                        name="tleLine2"
                        value={formData.tleLine2}
                        onChange={handleChange}
                        bg="gray.700"
                        borderColor="gray.500"
                        color="white"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                        _placeholder={{ color: "gray.400" }}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label color="white" fontWeight="medium">
                        Frequencies
                      </Field.Label>
                      <NativeSelect.Root>
                        <NativeSelect.Field
                          name="frequencies"
                          value={formData.frequencies}
                          onChange={handleChange}
                          bg="gray.700"
                          borderColor="gray.500"
                          color="white"
                          _hover={{ borderColor: "gray.400" }}
                          _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                        >
                          {Object.values(FrequencyType).map((f) => (
                            <option key={f} value={f} style={{ backgroundColor: '#2d3748', color: 'white' }}>
                              {f}
                            </option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator color="white" />
                      </NativeSelect.Root>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label color="white" fontWeight="medium">
                        Description
                      </Field.Label>
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
                    </Field.Root>
                  </Stack>
                </Fieldset.Content>
              </Fieldset.Root>
            </Dialog.Body>
            <Dialog.Footer
              bg="gray.700"
              borderTop="1px solid"
              borderColor="gray.600"
              px={6}
              py={4}
            >
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" color="white" borderColor="gray.500" _hover={{ bg: "gray.600" }}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button colorScheme="green" onClick={handleSubmit} ml={3}>
                Save
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AddSatelliteDialog;
