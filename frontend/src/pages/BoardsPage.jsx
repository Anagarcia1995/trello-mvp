import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/fetchClient";
import { useAuth } from "../auth/AuthContext";

export default function BoardsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  // Share state
  const [shareEmailByBoard, setShareEmailByBoard] = useState({});
  const [sharingBoardId, setSharingBoardId] = useState(null);

  async function loadBoards() {
    setLoading(true);
    try {
      const data = await apiFetch("/boards");
      setBoards(data);
    } catch (err) {
      console.error("Error cargando boards:", err.message);
      alert(err.message || "Error cargando boards");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoards();
  }, []);

  async function createBoard() {
    if (!title.trim()) return;
    setCreating(true);
    try {
      await apiFetch("/boards", {
        method: "POST",
        body: JSON.stringify({ title: title.trim() }),
      });
      setTitle("");
      await loadBoards();
    } catch (err) {
      console.error("Error creando board:", err.message);
      alert(err.message || "Error creando board");
    } finally {
      setCreating(false);
    }
  }

  async function shareBoard(boardId) {
    const email = (shareEmailByBoard[boardId] || "").trim();
    if (!email) return;

    setSharingBoardId(boardId);
    try {
      await apiFetch(`/boards/${boardId}/share`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setShareEmailByBoard((prev) => ({ ...prev, [boardId]: "" }));
      alert("Tablón compartido ✅");
      await loadBoards();
    } catch (err) {
      alert(err.message || "Error compartiendo tablón");
    } finally {
      setSharingBoardId(null);
    }
  }

  return (
    <Container maxW="xl" py={10}>
      <Stack spacing={6}>
        <Stack spacing={1}>
          <Heading>Tablones</Heading>
          <Text>Logueada como: {user?.email}</Text>
          <Button onClick={logout} variant="outline">
            Cerrar sesión
          </Button>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Input
            placeholder="Nuevo tablero..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button onClick={createBoard} isLoading={creating}>
            Crear
          </Button>
        </Stack>

        {loading ? (
          <Text>Cargando...</Text>
        ) : boards.length === 0 ? (
          <Text>No tienes tablones todavía.</Text>
        ) : (
          <Stack spacing={3}>
            {boards.map((b) => (
              <Stack key={b.id} direction="row" spacing={2} align="center">
                <Button
                  variant="outline"
                  justifyContent="flex-start"
                  onClick={() => navigate(`/boards/${b.id}`)}
                  flex="1"
                >
                  {b.title}
                </Button>

                <Input
                  placeholder="email para compartir"
                  value={shareEmailByBoard[b.id] || ""}
                  onChange={(e) =>
                    setShareEmailByBoard((prev) => ({
                      ...prev,
                      [b.id]: e.target.value,
                    }))
                  }
                  width="150px"
                />

                <Button
                  onClick={() => shareBoard(b.id)}
                  isLoading={sharingBoardId === b.id}
                >
                  Compartir
                </Button>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
