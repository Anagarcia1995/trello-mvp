import { Container, Link } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../api/fetchClient";
import AuthFormComponent from "../components/AuthFormComponent";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      navigate("/reset-password");
      alert("Si el email existe, te hemos enviado instrucciones.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxW="md" py={10}>
      <AuthFormComponent
        title="Cambia tu contraseña"
        submitLabel="Enviar"
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
