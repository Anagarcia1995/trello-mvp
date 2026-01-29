const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Cliente HTTP centralizado para la API
 * - Añade JWT automáticamente si existe
 * - Maneja errores de forma consistente
 */
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // respuesta sin body
  }

  // Token inválido o expirado → logout forzado
  if (res.status === 401) {
    localStorage.removeItem("token");
  }

  if (!res.ok) {
    const message = data?.message || `HTTP Error ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}
