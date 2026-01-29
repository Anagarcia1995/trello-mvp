import { Container, Link } from "@chakra-ui/react";
import { Link as RouterLink, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../api/fetchClient";
import { useAuth } from "../auth/AuthContext";
import AuthFormComponent from "../components/AuthFormComponent";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const navigate = useNavigate();
  const { reloadMe } = useAuth();

  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    if (!token) return alert("Token inválido o faltante. Vuelve a solicitar el reset.");
    if (!password) return alert("Introduce una nueva contraseña");
    if (password !== repeat) return alert("Las contraseñas no coinciden");

    setLoading(true);
    try {
      const data = await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword: password }),
      });

      // Auto-login (backend devuelve data.token)
      localStorage.setItem("token", data.token);
      await reloadMe();

      alert("Contraseña actualizada");
      navigate("/boards");
    } catch (err) {
      alert(err.message || "Error actualizando contraseña");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxW="md" py={10}>
      <AuthFormComponent
        title="Nueva contraseña"
        submitLabel="Actualizar"
        loading={loading}
        onSubmit={onSubmit}
        fields={[
          {
            name: "password",
            label: "Nueva contraseña",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
          },
          {
            name: "repeat",
            label: "Repite contraseña",
            type: "password",
            value: repeat,
            onChange: (e) => setRepeat(e.target.value),
          },
        ]}
        footer={
          <Link as={RouterLink} to="/login">
            Volver a login
          </Link>
        }
      />
    </Container>
  );
}
