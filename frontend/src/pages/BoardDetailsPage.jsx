import { useEffect, useMemo, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { DndContext } from "@dnd-kit/core";
import { apiFetch } from "../api/fetchClient";
import TaskCard from "../components/TaskCardComponent";
import BoardColumn from "../components/BoardColumnComponent";

export default function BoardDetailsPage() {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [board, setBoard] = useState(null);

  async function loadTasks() {
    setLoadingTasks(true);
    try {
      const data = await apiFetch(`/boards/${id}/tasks`);
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks:", err.message);
      alert(err.message || "Error cargando tareas");
    } finally {
      setLoadingTasks(false);
    }
  }

  async function loadBoard() {
    setLoadingBoard(true);
    try {
      const data = await apiFetch(`/boards/${id}`);
      setBoard(data);
    } catch (err) {
      console.error("Error loading board:", err.message);
      alert("No se pudo cargar el tablero");
    } finally {
      setLoadingBoard(false);
    }
  }

  useEffect(() => {
    loadBoard();
    loadTasks();
  }, [id]);

  async function createTask() {
    const title = newTitle.trim();
    if (!title) {
      alert("Escribe un título para la tarea");
      return;
    }

    setCreating(true);
    try {
      await apiFetch(`/boards/${id}/tasks`, {
        method: "POST",
        body: JSON.stringify({
          title,
          description: newDescription.trim() || null,
        }),
      });

      setNewTitle("");
      setNewDescription("");
      await loadTasks();
    } catch (err) {
      console.error("Error creating task:", err.message);
      alert(err.message || "Error creando tarea");
    } finally {
      setCreating(false);
    }
  }

  const grouped = useMemo(
    () => ({
      todo: tasks.filter((t) => t.status === "todo"),
      doing: tasks.filter((t) => t.status === "doing"),
      done: tasks.filter((t) => t.status === "done"),
    }),
    [tasks]
  );

  // Numeración por board (estable por orden de creación)
  const taskNumberById = useMemo(() => {
    const map = new Map();
    [...tasks]
      .sort((a, b) => a.id - b.id)
      .forEach((t, idx) => map.set(t.id, idx + 1));
    return map;
  }, [tasks]);

  async function updateTaskStatus(taskId, newStatus) {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
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

    if (!task || task.status === newStatus) return;

    updateTaskStatus(task.id, newStatus);
  }

  return (
    <Container maxW="6xl" py={8}>
      <Stack spacing={6}>
        <Stack spacing={2}>
          <Stack direction="row" justify="space-between" align="center">
            <Heading size="lg">
              {loadingBoard ? "Cargando..." : board?.title}
            </Heading>

            <Button as={RouterLink} to="/boards" variant="outline">
              Volver a tablones
            </Button>
          </Stack>

          {board?.members?.length ? (
            <Stack direction="row" wrap="wrap" spacing={2}>
              {board.members.map((m) => (
                <Text key={m.id} fontSize="sm">
                  • {m.name || m.email}
                </Text>
              ))}
            </Stack>
          ) : (
            <Text fontSize="sm" color="gray.600">
              Nadie (solo tú)
            </Text>
          )}
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
            <Button onClick={createTask} isLoading={creating} alignSelf="flex-start">
              Crear
            </Button>
          </Stack>
        </Box>

        {loadingTasks ? (
          <Text>Cargando tareas…</Text>
        ) : (
          <DndContext onDragEnd={onDragEnd}>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
              <BoardColumn status="todo" title={`TO DO (${grouped.todo.length})`}>
                {grouped.todo.map((t) => (
                  <TaskCard key={t.id} task={t} number={taskNumberById.get(t.id)} />
                ))}
              </BoardColumn>

              <BoardColumn status="doing" title={`DOING (${grouped.doing.length})`}>
                {grouped.doing.map((t) => (
                  <TaskCard key={t.id} task={t} number={taskNumberById.get(t.id)} />
                ))}
              </BoardColumn>

              <BoardColumn status="done" title={`DONE (${grouped.done.length})`}>
                {grouped.done.map((t) => (
                  <TaskCard key={t.id} task={t} number={taskNumberById.get(t.id)} />
                ))}
              </BoardColumn>
            </Box>
          </DndContext>
        )}
      </Stack>
    </Container>
  );
}
