import { Box, Text } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({ task, number }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: String(task.id), // ⚠️ debe ser único y estable
      data: { task },
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      borderWidth="1px"
      borderRadius="md"
      p={3}
      {...listeners}
      {...attributes}
    >
      <Text fontWeight="600">{task.title}</Text>

      {task.description ? (
        <Text fontSize="xs" color="gray.600" mt={1}>
          {task.description}
        </Text>
      ) : null}

      <Text fontSize="xs" color="gray.500" mt={2}>
        #{number ?? task.id}
      </Text>
    </Box>
  );
}
