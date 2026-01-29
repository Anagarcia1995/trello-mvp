import React, { useEffect, useState } from "react";
import { Button, Container, Heading, Input, Stack, Text } from "@chakra-ui/react";
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
    // recarga cuando cambia el usuario (ej: login/logout)
  }, [user?.id]);

  async function createBoard() {
    const t = title.trim();
    if (!t) {
      alert("Escribe un título para el tablero");
      return;
    }

    setCreating(true);
    try {
      await apiFetch("/boards", {
        method: "POST",
        body: JSON.stringify({ title: t }),
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
    if (!email) {
      alert("Introduce un email para compartir");
      return;
    }

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
    <Container maxW="xl" py={20}>
      <Stack spacing={6}>
        <Stack spacing={2}>
          <Stack direction="row" justify="space-between" align="center">
            <Heading>Tablones</Heading>
            <Button onClick={logout} variant="outline">
              Cerrar sesión
            </Button>
          </Stack>

          <Text>Logueada como: {user?.name || user?.email}</Text>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Input
            placeholder="Nuevo tablero..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button onClick={createBoard} isLoading={creating} width="85px">
            Crear
          </Button>
        </Stack>

        {loading ? (
          <Text>Cargando...</Text>
        ) : boards.length === 0 ? (
          <Text>No tienes tablones todavía.</Text>
        ) : (
          <Stack spacing={3}>
            {boards.map((b) => {
              const shareEmail = shareEmailByBoard[b.id] || "";
              const canShare = shareEmail.trim().length > 0;

              return (
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
                    value={shareEmail}
                    onChange={(e) =>
                      setShareEmailByBoard((prev) => ({
                        ...prev,
                        [b.id]: e.target.value,
                      }))
                    }
                    width="160px"
                  />

                  <Button
                    onClick={() => shareBoard(b.id)}
                    isLoading={sharingBoardId === b.id}
                    isDisabled={!canShare || sharingBoardId !== null}
                    width="85px"
                  >
                    Compartir
                  </Button>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
