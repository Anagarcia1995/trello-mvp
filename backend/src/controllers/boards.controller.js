const { Board, BoardUser, User } = require("../../models");
const { Op } = require("sequelize");

// Crea un tablon y lo asigna al usuario autenticado como owner
async function createBoard(req, res) {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const board = await Board.create({
      title,
      ownerId: req.user.userId,
    });

    return res.status(201).json(board);
  } catch (err) {
    return res.status(500).json({ message: "Error creating board", error: err.message });
  }
}

// Devuelve los tablones accesibles por el usuario: los propios del 
// owner mas los que tienen relacion con el
async function getBoards(req, res) {
  try {
    const userId = req.user.userId;

    const boards = await Board.findAll({
      where: {
        [Op.or]: [
          { ownerId: userId },
          { "$members.id$": userId },
        ],
      },
      // Incluiamos a los miembros para que tengan también acceso
      include: [
        {
          model: User,
          as: "members",
          attributes: ["id", "name", "email"],
          through: { attributes: [] },
        },
      ],
      distinct: true, //evitamos duplicados cuando hay joins
    });

    return res.json(boards);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching boards", error: err.message });
  }
}

// El owner comparte un tablon con otro usuario por email
async function shareBoard(req, res) {
  try {
    const boardId = req.params.id;
    const { email } = req.body;
    const userId = req.user.userId;

    if (!email) {
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

    const userToShare = await User.findOne({ where: { email } });
    if (!userToShare) {
      return res.status(404).json({ message: "User not found" });
    }

    // findOrCreate evita duplicar miembros, si ya esta compartido, no crea otra fila
    await BoardUser.findOrCreate({
      where: {
        boardId: board.id,
        userId: userToShare.id,
      },
    });

    return res.json({ message: "Board shared successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error sharing board", error: err.message });
  }
}

module.exports = { createBoard, getBoards, shareBoard };
