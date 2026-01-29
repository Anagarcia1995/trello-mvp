import React, { useState } from "react";
import { Box, Button, Container, Heading, Input, Link, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/fetchClient";
import { useAuth } from "../auth/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { reloadMe } = useAuth();

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    console.log("Intentando login con:", { email });

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      localStorage.setItem("token", data.token);
      await reloadMe();
      navigate("/boards");
    } catch (err) {
      console.error("Error register:", err.message);
      alert(err.message || "Error al registrarte");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container maxW="md" py={10}>
      <Stack spacing={6}>
        <Heading>Registro</Heading>

        <Box as="form" onSubmit={onSubmit}>
          <Stack spacing={4}>
            <Stack spacing={1}>
              <Text>Nombre</Text>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Stack>

            <Stack spacing={1}>
              <Text>Email</Text>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </Stack>

            <Stack spacing={1}>
              <Text>Password</Text>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
            </Stack>

            <Button type="submit" isLoading={submitting}>
              Crear cuenta
            </Button>

            <Link as={RouterLink} to="/login">
              Ya tengo cuenta → Login
            </Link>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
