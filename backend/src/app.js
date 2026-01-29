const express = require("express");
const cors = require("cors");

const { authRouter } = require("./routes/auth.routes");
const { boardsRouter } = require("./routes/boards.routes");
const { tasksRouter } = require("./routes/tasks.routes");

const { authMiddleware } = require("./middlewares/auth.middleware");
const { User } = require("../models");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/health", (req, res) => {
  return res.status(200).json({ ok: true, message: "API running" });
});

// Rutas
app.use("/auth", authRouter);
app.use("/boards", boardsRouter);
app.use("/", tasksRouter);

// Ruta protegida: devuelve el usuario autenticado
app.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user.userId, {
    attributes: ["id", "name", "email", "createdAt", "updatedAt"],
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({ user });
});

module.exports = app;
