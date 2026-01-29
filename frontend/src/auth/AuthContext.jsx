import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "../api/fetchClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Evita condiciones de carrera: si hay varias llamadas a loadMe,
  // solo la última debería poder actualizar el estado.
  const requestIdRef = useRef(0);

  async function loadMe() {
    const currentRequestId = ++requestIdRef.current;

    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const meResponse = await apiFetch("/me");

      // Si otra llamada a loadMe se lanzó después, ignoramos esta respuesta
      if (currentRequestId !== requestIdRef.current) return;

      // Backend: { user: {...} }
      setUser(meResponse?.user ?? null);
    } catch {
      if (currentRequestId !== requestIdRef.current) return;

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      if (currentRequestId !== requestIdRef.current) return;
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthed: !!user,
      reloadMe: loadMe,
      logout: () => {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
