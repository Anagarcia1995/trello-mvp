const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { boardAccessMiddleware } = require("../middlewares/boardAccess.middleware");
const { createTask, getBoardTasks, updateTask } = require("../controllers/tasks.controller");

const router = express.Router();

router.post("/boards/:id/tasks", authMiddleware, boardAccessMiddleware, createTask);
router.get("/boards/:id/tasks", authMiddleware, boardAccessMiddleware, getBoardTasks);

router.patch("/tasks/:taskId", authMiddleware, updateTask);

module.exports = { tasksRouter: router };
