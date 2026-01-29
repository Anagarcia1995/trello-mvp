const jwt = require("jsonwebtoken");

/**
 * Middleware de autenticación.
 * Verifica el JWT enviado en el header Authorization (Bearer <token>).
 * Si es válido, guarda el payload en req.user y continúa.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
  }

  // Extrae el token de forma robusta (evita problemas con espacios extra)
  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { authMiddleware };
