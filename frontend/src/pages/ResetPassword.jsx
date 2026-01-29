import { Container, Link } from "@chakra-ui/react";
import { Link as RouterLink, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../api/fetchClient";
import AuthFormComponent from "../components/AuthFormComponent";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (password !== repeat) return alert("Las contraseñas no coinciden");

    setLoading(true);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword: password }),
      });
      alert("Contraseña actualizada");
      navigate("/login");
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
