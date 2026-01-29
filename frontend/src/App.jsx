import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/AuthProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BoardsPage from "./pages/BoardsPage";
import BoardDetailsPage from "./pages/BoardDetailsPage";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";

/**
 * Definición de rutas de la aplicación.
 * Las rutas /boards están protegidas por autenticación.
 */

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        <Route path="/boards" element={ <ProtectedRoute> <BoardsPage /> </ProtectedRoute> } />
        <Route path="/boards/:id" element={ <ProtectedRoute> <BoardDetailsPage /> </ProtectedRoute> } />
      </Routes>
    </AuthProvider>
  );
}
