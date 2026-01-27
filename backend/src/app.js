// Configuración principal de la app Express
// Aquí se montan middlewares y rutas
const express = require("express");
const cors = require("cors");
const { authRouter } = require("./routes/auth.routes");
const { authMiddleware } = require("./middlewares/auth.middleware");
const { User } = require("../models");
const { boardsRouter} = require("./routes/boards.routes");
const { tasksRouter } = require("./routes/tasks.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, message: "API running" });
});

app.use("/auth", authRouter);
app.use("/boards", boardsRouter)
app.use("/", tasksRouter);

// Ruta protegida de prueba para comprobar que el JWT y el middleware funcionan
app.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user.userId, {
    attributes: ["id", "name", "email", "createdAt", "updatedAt"],
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({ user });
});

module.exports = app;
