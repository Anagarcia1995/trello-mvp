const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  createBoard,
  getBoards,
  shareBoard,
} = require("../controllers/boards.controller");

const router = express.Router();

router.post("/", authMiddleware, createBoard);
router.get("/", authMiddleware, getBoards);
router.post("/:id/share", authMiddleware, shareBoard);

module.exports = { boardsRouter: router };
