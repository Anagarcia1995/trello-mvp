const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../models");

/**
 * Token de recuperación (MVP).
 * En producción: se enviaría por email dentro de un link.
 */
function signResetToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.RESET_PASSWORD_SECRET,
    { expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN || "15m" }
  );
}

/**
 * Token de sesión (login/register/reset).
 */
function signSessionToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// Genera un token de recuperación, en un sistema real se envía por email
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "email is required" });

    const user = await User.findOne({ where: { email } });

    /**
     * Respuesta uniforme por seguridad:
     * no revelamos si el email existe o no.
     * Importante para frontend: devolvemos siempre `token` (null si no existe).
     */
    if (!user) {
      return res.json({
        message: "If the email exists, a reset link will be sent.",
        token: null,
      });
    }

    const token = signResetToken(user);

    return res.json({
      message: "Password reset token generated (MVP).",
      token,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error generating reset token", error: err.message });
  }
}

// Cambia la contraseña usando el token generado con forgot-password
async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "token and newPassword are required" });
    }

    if (newPassword.length < 3) {
      return res
        .status(400)
        .json({ message: "Password must be at least 3 characters" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findByPk(payload.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    // ✅ Auto-login tras cambiar contraseña
    const sessionToken = signSessionToken(user);

    return res.json({
      message: "Password updated successfully",
      token: sessionToken,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error resetting password", error: err.message });
  }
}

module.exports = { forgotPassword, resetPassword };
