import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Protege rutas privadas.
 * - Mientras se carga el usuario, muestra estado de carga.
 * - Si no está autenticado, redirige a /login.
 */
export default function ProtectedRoute({ children }) {
  const { loading, isAuthed } = useAuth();

  if (loading) return <div style={{ padding: 24 }}>Cargando...</div>;
  if (!isAuthed) return <Navigate to="/login" replace />;

  return children;
}
