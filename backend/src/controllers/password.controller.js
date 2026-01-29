const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../models");

// Genera un token de recuperación, en un sistema real se envia por email
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "email is required" });

    const user = await User.findOne({ where: { email } });

    // No relevamos si el email existe por seguridad
    if (!user) {
      return res.json({ message: "If the email exists, a reset link will be sent." });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: process.env.RESET_PASSWORD_EXPIRES_IN || "15m" }
    );

    return res.json({
      message: "Password reset token generated (MVP).",
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error generating reset token", error: err.message });
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
      return res.status(400).json({ message: "Password must be at least 3 characters" });
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

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error resetting password", error: err.message });
  }
}

module.exports = { forgotPassword, resetPassword };
