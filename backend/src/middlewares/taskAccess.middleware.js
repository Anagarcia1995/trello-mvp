const { Task, Board, BoardUser } = require("../../models");

/**
 * Middleware de autorización para Tasks.
 * Permite acceso si el usuario tiene acceso al board al que pertenece la task:
 *  - owner del board, o
 *  - miembro del board (BoardUser)
 *
 * Si tiene acceso:
 *  - deja la task en req.task
 *  - deja el board en req.board
 */
async function taskAccessMiddleware(req, res, next) {
  try {
    const taskId = Number(req.params.taskId);
    const userId = req.user.userId;

    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const board = await Board.findByPk(task.boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Mismas reglas que boardAccessMiddleware: owner o miembro
    if (board.ownerId === userId) {
      req.task = task;
      req.board = board;
      return next();
    }

    const membership = await BoardUser.findOne({
      where: { boardId: board.id, userId },
    });

    if (!membership) {
      return res.status(403).json({ message: "No access to this board" });
    }

    req.task = task;
    req.board = board;
    return next();
  } catch (err) {
    return res.status(500).json({
      message: "Task access check error",
      error: err.message,
    });
  }
}

module.exports = { taskAccessMiddleware };
