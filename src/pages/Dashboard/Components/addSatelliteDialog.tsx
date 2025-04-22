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

const AddSatelliteDialog = () => {
  const [open, setOpen] = useState(false)
  const createSatellite = useSatelliteStore((state) => state.createSatellite);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    semiMajorAxis: "",
    eccentricity: "",
    inclination: "",
    raan: "",
    argOfPeriapsis: "",
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
          semiMajorAxis: json.orbit?.semiMajorAxis?.toString() ?? "",
          eccentricity: json.orbit?.eccentricity?.toString() ?? "",
          inclination: json.orbit?.inclination?.toString() ?? "",
          raan: json.orbit?.raan?.toString() ?? "",
          argOfPeriapsis: json.orbit?.argOfPeriapsis?.toString() ?? "",
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
        orbit: {
          semiMajorAxis: parseFloat(formData.semiMajorAxis) || 0,
          eccentricity: parseFloat(formData.eccentricity) || 0,
          inclination: parseFloat(formData.inclination) || 0,
          raan: parseFloat(formData.raan) || 0,
          argOfPeriapsis: parseFloat(formData.argOfPeriapsis) || 0,
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
          <Button colorScheme="green" >
            + Add Satellite
          </Button>
        </Dialog.Trigger>
      </Flex>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create Satellite</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              <Fieldset.Root size="lg" maxW="md">
                <Fieldset.Content>
                  <Stack gap={4}>
                    <Field.Root>
                      <Field.Label>Import from file</Field.Label>
                      <Input type="file" accept=".json" onChange={handleFileUpload} />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Name</Field.Label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Semi-Major Axis</Field.Label>
                      <Input
                        name="semiMajorAxis"
                        value={formData.semiMajorAxis}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Eccentricity</Field.Label>
                      <Input
                        name="eccentricity"
                        value={formData.eccentricity}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Inclination</Field.Label>
                      <Input
                        name="inclination"
                        value={formData.inclination}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>RAAN</Field.Label>
                      <Input
                        name="raan"
                        value={formData.raan}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Argument of Periapsis</Field.Label>
                      <Input
                        name="argOfPeriapsis"
                        value={formData.argOfPeriapsis}
                        onChange={handleChange}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Frequencies</Field.Label>
                      <NativeSelect.Root>
                        <NativeSelect.Field
                          name="frequencies"
                          value={formData.frequencies}
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
                  </Stack>
                </Fieldset.Content>
              </Fieldset.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button colorScheme="green" onClick={handleSubmit}>
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
