import React from "react";
import { Box, Heading, Stack } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";

export default function BoardColumn({ status, title, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status, // "todo" | "doing" | "done"
  });

/**
 * Columna del tablero (TODO / DOING / DONE).
 * Usa dnd-kit para permitir soltar tareas según su estado.
 */

  return (
    <Box
      ref={setNodeRef}
      borderWidth="1px"
      borderRadius="md"
      p={4}
      minH="300px"
      bg={isOver ? "gray.50" : "transparent"}
    >
      <Heading size="sm" mb={3}>
        {title}
      </Heading>

      <Stack spacing={3}>{children}</Stack>
    </Box>
  );
}
