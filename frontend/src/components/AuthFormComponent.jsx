import { Box, Button, Input, Stack, Text, Heading } from "@chakra-ui/react";

/**
 *  * Formulario genérico para auth (login / register / reset).
 *  * Recibe campos dinámicos y maneja submit/loading.
 * 
 */

export default function AuthFormComponent({
  title,
  fields,
  submitLabel,
  onSubmit,
  loading,
  footer,
}) {
  return (
    <Box as="form" onSubmit={onSubmit}>
      <Stack spacing={4}>
        <Heading size="md">{title}</Heading>

        {fields.map((field) => (
          <Stack spacing={1} key={field.name}>
            <Text>{field.label}</Text>
            <Input {...field} />
          </Stack>
        ))}

        <Button type="submit" isLoading={loading}>
          {submitLabel}
        </Button>

        {footer}
      </Stack>
    </Box>
  );
}
