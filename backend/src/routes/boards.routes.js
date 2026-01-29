const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  createBoard,
  getBoards,
  shareBoard,
  getBoardById,
} = require("../controllers/boards.controller");

const router = express.Router();

// Boards (todas las rutas requieren autenticación)
router.post("/", authMiddleware, createBoard);
router.get("/", authMiddleware, getBoards);
router.get("/:id", authMiddleware, getBoardById);
router.post("/:id/share", authMiddleware, shareBoard);

module.exports = { boardsRouter: router };
