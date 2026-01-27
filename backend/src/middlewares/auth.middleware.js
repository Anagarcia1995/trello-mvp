const jwt = require("jsonwebtoken");

// Middleware de autenticación
// Comprueba que la peticion tenga un JWT válido en el Header, si es
// correcta se guarda la informacion del user en req.user para que pueda
// usarse en los controllers
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { authMiddleware };
