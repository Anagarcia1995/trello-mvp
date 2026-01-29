import { Container, Link } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../api/fetchClient";
import { useAuth } from "../auth/AuthContext";
import AuthFormComponent from "../components/AuthFormComponent";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { reloadMe } = useAuth();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.token);
      await reloadMe();
      navigate("/boards");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxW="md" py={10}>
      <AuthFormComponent
        title="Login"
        submitLabel="Entrar"
        loading={loading}
        onSubmit={onSubmit}
        fields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
          },
        ]}
        footer={
          <>
            <Link as={RouterLink} to="/forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
            <Link as={RouterLink} to="/register">
              No tengo cuenta → Registro
            </Link>
          </>
        }
      />
    </Container>
  );
}
