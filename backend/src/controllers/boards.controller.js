const { Board, BoardUser, User } = require("../../models");
const { Op } = require("sequelize");

/**
 * Convierte un param id en entero y valida.
 * Devuelve null si no es un número válido.
 */
function parseId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function boardInclude() {
  return [
    {
      model: User,
      as: "members",
      attributes: ["id", "name", "email"],
      through: { attributes: [] },
      required: false,
    },
    {
      model: User,
      as: "owner",
      attributes: ["id", "name", "email"],
      required: false,
    },
  ];
}

async function createBoard(req, res) {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    const board = await Board.create({
      title: title.trim(),
      ownerId: req.user.userId,
    });

    return res.status(201).json(board);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating board", error: err.message });
  }
}

async function getBoards(req, res) {
  try {
    const userId = req.user.userId;

    const boards = await Board.findAll({
      where: {
        [Op.or]: [{ ownerId: userId }, { "$members.id$": userId }],
      },
      include: [
        {
          model: User,
          as: "members",
          attributes: ["id", "name", "email"],
          through: { attributes: [] },
          required: false,
        },
      ],
      distinct: true,
    });

    return res.json(boards);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching boards", error: err.message });
  }
}

async function getBoardById(req, res) {
  try {
    const boardId = parseId(req.params.id);
    if (!boardId) {
      return res.status(400).json({ message: "Invalid board id" });
    }

    const userId = req.user.userId;

    const board = await Board.findByPk(boardId, {
      include: boardInclude(),
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Permiso: owner o miembro
    const isOwner = board.ownerId === userId;
    const isMember = (board.members || []).some((m) => m.id === userId);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(board);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching board", error: err.message });
  }
}

async function shareBoard(req, res) {
  try {
    const boardId = parseId(req.params.id);
    if (!boardId) {
      return res.status(400).json({ message: "Invalid board id" });
    }

    const { email } = req.body;
    const userId = req.user.userId;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "email is required" });
    }

    const board = await Board.findByPk(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Solo owner puede compartir
    if (board.ownerId !== userId) {
      return res.status(403).json({ message: "Only owner can share this board" });
    }

    const userToShare = await User.findOne({ where: { email: email.trim() } });
    if (!userToShare) {
      return res.status(404).json({ message: "User not found" });
    }

    // Evita duplicados si ya existe
    await BoardUser.findOrCreate({
      where: {
        boardId: board.id,
        userId: userToShare.id,
      },
    });

    // Devolver el board actualizado con miembros
    const updatedBoard = await Board.findByPk(board.id, { include: boardInclude() });

    return res.json({
      message: "Board shared successfully",
      board: updatedBoard,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error sharing board", error: err.message });
  }
}

module.exports = { createBoard, getBoards, getBoardById, shareBoard };
