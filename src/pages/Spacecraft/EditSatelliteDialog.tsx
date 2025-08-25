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
import { useState, useEffect } from "react";
import { FrequencyType } from "@/store/useGroundStationStore";
import { useSatelliteStore, Satellite } from "@/store/useSatelliteStore";

interface EditSatelliteDialogProps {
  satellite: Satellite;
  isOpen: boolean;
  onClose: () => void;
}

const EditSatelliteDialog = ({ satellite, isOpen, onClose }: EditSatelliteDialogProps) => {
  const updateSatellite = useSatelliteStore((state) => state.updateSatellite);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    tleLine1: "",
    tleLine2: "",
    frequencies: "s-band",
    description: "",
    pathColor: "",
    modelScale: "",
    isMaster: false,
    masterRange: "",
  });

  // Update form data when satellite prop changes
  useEffect(() => {
    if (satellite) {
      setFormData({
        id: satellite.id,
        name: satellite.name,
        tleLine1: satellite.tle?.line1 ?? "",
        tleLine2: satellite.tle?.line2 ?? "",
        frequencies: satellite.frequencies?.[0] ?? "s-band",
        description: satellite.description ?? "",
        pathColor: satellite.pathColor ?? "#00ffff",
        modelScale: satellite.modelScale?.toString() ?? "10000",
        isMaster: satellite.isMaster ?? false,
        masterRange: satellite.masterRange?.toString() ?? "0",
      });
    }
  }, [satellite]);

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

  const handleSubmit = () => {
    try {
      updateSatellite(satellite.id, {
        name: formData.name,
        tle: {
          line1: formData.tleLine1,
          line2: formData.tleLine2,
        },
        frequencies: [formData.frequencies],
        description: formData.description,
        pathColor: formData.pathColor,
        modelScale: parseFloat(formData.modelScale) || 10000,
        isMaster: formData.isMaster,
        masterRange: parseFloat(formData.masterRange) || 0,
      });
      onClose();
    } catch (err) {
      console.error("Error updating satellite:", err);
    }
  };

  return (
    <Dialog.Root lazyMount open={isOpen} onOpenChange={(e) => onClose()}>
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
                Edit Satellite: {satellite.name}
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" color="white" onClick={onClose} />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body bg="gray.800" px={6} py={4}>
              <Fieldset.Root size="lg" maxW="md">
                <Fieldset.Content>
                  <Stack gap={4}>
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
                        Path Color
                      </Field.Label>
                      <Input
                        name="pathColor"
                        type="color"
                        value={formData.pathColor}
                        onChange={handleChange}
                        bg="gray.700"
                        borderColor="gray.500"
                        color="white"
                        _hover={{ borderColor: "gray.400" }}
                        _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                        h="40px"
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label color="white" fontWeight="medium">
                        Model Scale
                      </Field.Label>
                      <Input
                        name="modelScale"
                        value={formData.modelScale}
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
                        Master Range (m)
                      </Field.Label>
                      <Input
                        name="masterRange"
                        value={formData.masterRange}
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

export default EditSatelliteDialog;
