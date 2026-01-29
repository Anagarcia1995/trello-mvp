import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading, isAuthed } = useAuth();

  if (loading) return <div style={{ padding: 24 }}>Cargando...</div>;

  if (!isAuthed) return <Navigate to="/login" replace />;

  return children;
}
