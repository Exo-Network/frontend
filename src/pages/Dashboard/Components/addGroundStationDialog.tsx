import {
  Button,
  CloseButton,
  Dialog,
  Flex,
  Input,
  Portal,
  Textarea,
  useDisclosure,
  Fieldset,
  Field,
  Stack,
  NativeSelect,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  useGroundStationStore,
  FrequencyType,
} from "@/store/useGroundStationStore";

const AddGroundStationDialog = () => {
  const createStation = useGroundStationStore((state) => state.createStation);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    lat: "",
    lon: "",
    alt: "",
    owner: "",
    description: "",
    frequency: FrequencyType.S,
  });

  //   const toast = useToast();
  const { open, onOpen, onClose } = useDisclosure();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    try {
      createStation({
        id: formData.id || crypto.randomUUID(),
        name: formData.name,
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
        alt: parseFloat(formData.alt) || 0,
        frequencies: [formData.frequency],
        color: "#00FF00",
        owner: formData.owner,
        costPerMb: 0.05,
        description: formData.description,
      });
      onClose();
    } catch (err) {}
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => (v ? onOpen() : onClose())}>
      <Flex justify="flex-end" mb={4}>
        <Dialog.Trigger asChild>
          <Button colorScheme="green">+ Add Ground Station</Button>
        </Dialog.Trigger>
      </Flex>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create Ground Station</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Fieldset.Root size="lg" maxW="md">
                <Stack>
                  <Fieldset.Legend>Station details</Fieldset.Legend>
                </Stack>
                <Fieldset.Content>
                  <Field.Root>
                    <Field.Label>Name</Field.Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Latitude</Field.Label>
                    <Input
                      name="lat"
                      value={formData.lat}
                      onChange={handleChange}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Longitude</Field.Label>
                    <Input
                      name="lon"
                      value={formData.lon}
                      onChange={handleChange}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Altitude</Field.Label>
                    <Input
                      name="alt"
                      value={formData.alt}
                      onChange={handleChange}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Owner</Field.Label>
                    <Input
                      name="owner"
                      value={formData.owner}
                      onChange={handleChange}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Frequencies</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                      >
                        {Object.values(FrequencyType).map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </Field.Root>
                </Fieldset.Content>
              </Fieldset.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger onClick={()=>onClose()} asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button colorScheme="green" onClick={handleSubmit}>
                Save
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

export default AddGroundStationDialog;
