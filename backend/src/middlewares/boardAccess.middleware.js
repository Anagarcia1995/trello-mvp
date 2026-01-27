const { Board, BoardUser } = require("../../models");

// Middleware de autorizacion para los tablones
// Comprueba si el usuario autenticado tiene acceso como owner o miembro
async function boardAccessMiddleware(req, res, next) {
  try {
    const boardId = req.params.id;
    const userId = req.user.userId;

    const board = await Board.findByPk(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Si es owner tiene acceso directo
    if (board.ownerId === userId) {
      req.board = board;
      return next();
    }

    // Si no es owner comprobamos si el tablon esta compartido con él
    const membership = await BoardUser.findOne({
      where: { boardId: board.id, userId },
    });

    if (!membership) {
      return res.status(403).json({ message: "No access to this board" });
    }

    req.board = board;
    return next();
  } catch (err) {
    return res.status(500).json({ message: "Access check error", error: err.message });
  }
}

module.exports = { boardAccessMiddleware };
