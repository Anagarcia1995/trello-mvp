import { useEffect, useMemo, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Heading, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { DndContext } from "@dnd-kit/core";
import { apiFetch } from "../api/fetchClient";
import TaskCard from "../components/TaskCardComponent";
import BoardColumn from "../components/BoardColumnComponent";

export default function BoardDetailsPage() {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const [shareEmailByBoard, setShareEmailByBoard] = useState({});
  const [sharingBoardId, setSharingBoardId] = useState(null);

  async function loadTasks() {
    setLoading(true);
    try {
      const data = await apiFetch(`/boards/${id}/tasks`);
      setTasks(data);
    } catch (err) {
      console.error(err.message);
      alert(err.message || "Error cargando tareas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, [id]);

  async function createTask() {
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      await apiFetch(`/boards/${id}/tasks`, {
        method: "POST",
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim() || null,
        }),
      });

      setNewTitle("");
      setNewDescription("");
      await loadTasks();
    } catch (err) {
      console.error(err.message);
      alert(err.message || "Error creando tarea");
    } finally {
      setCreating(false);
    }
  }

  const grouped = useMemo(() => {
    return {
      todo: tasks.filter((t) => t.status === "todo"),
      doing: tasks.filter((t) => t.status === "doing"),
      done: tasks.filter((t) => t.status === "done"),
    };
  }, [tasks]);

  async function updateTaskStatus(taskId, newStatus) {
    setTasks((prev) =>
      prev.map((t) =>
        String(t.id) === String(taskId) ? { ...t, status: newStatus } : t
      )
    );

    try {
      await apiFetch(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      alert(err.message || "Error actualizando estado. Reintentando...");
      await loadTasks(); 
    }
  }

  function onDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const task = active.data.current?.task;
    const newStatus = over.id;

    if (!task) return;
    if (task.status === newStatus) return;

    updateTaskStatus(task.id, newStatus);
  }


  return (
    <Container maxW="6xl" py={8}>
      <Stack spacing={6}>
        <Stack direction="row" justify="space-between" align="center">
          <Heading size="lg">Tablón #{id}</Heading>
          <Button as={RouterLink} to="/boards" variant="outline">
            Volver a tablones
          </Button>
        </Stack>

        <Box borderWidth="1px" borderRadius="md" p={4}>
          <Heading size="sm" mb={3}>
            Crear tarea
          </Heading>

          <Stack spacing={3}>
            <Input
              placeholder="Nombre de la tarea"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Textarea
              placeholder="Descripción (opcional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <Button
              onClick={createTask}
              isLoading={creating}
              alignSelf="flex-start"
            >
              Crear
            </Button>
          </Stack>
        </Box>

        {loading ? (
          <Text>Cargando tareas…</Text>
        ) : (
          <DndContext onDragEnd={onDragEnd}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
              <BoardColumn
                status="todo"
                title={`TODO (${grouped.todo.length})`}
              >
                {grouped.todo.map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))}
              </BoardColumn>

              <BoardColumn
                status="doing"
                title={`DOING (${grouped.doing.length})`}
              >
                {grouped.doing.map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))}
              </BoardColumn>

              <BoardColumn
                status="done"
                title={`DONE (${grouped.done.length})`}
              >
                {grouped.done.map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))}
              </BoardColumn>
            </Box>
          </DndContext>
        )}
      </Stack>
    </Container>
  );
}
