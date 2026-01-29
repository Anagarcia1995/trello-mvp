const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { boardAccessMiddleware } = require("../middlewares/boardAccess.middleware");
const { taskAccessMiddleware } = require("../middlewares/taskAccess.middleware");
const {
  createTask,
  getBoardTasks,
  updateTask,
} = require("../controllers/tasks.controller");

const router = express.Router();

// Tasks dentro de un board (requiere acceso al board)
router.post("/boards/:id/tasks", authMiddleware, boardAccessMiddleware, createTask);
router.get("/boards/:id/tasks", authMiddleware, boardAccessMiddleware, getBoardTasks);

// Actualizar task por id (requiere acceso al board al que pertenece esa task)
router.patch("/tasks/:taskId", authMiddleware, taskAccessMiddleware, updateTask);

module.exports = { tasksRouter: router };
