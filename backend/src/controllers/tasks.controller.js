const { Task, Board, BoardUser } = require("../../models");

// req.board viene del middleware boardAccessMiddleware (validó permisos)
async function createTask(req, res) {
  try {
    const boardId = req.board.id;
    const { title, description } = req.body;

    if (!title) return res.status(400).json({ message: "title is required" });

    const task = await Task.create({
      title,
      description: description || null,
      status: "todo",
      boardId,
    });

    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: "Error creating task", error: err.message });
  }
}

async function getBoardTasks(req, res) {
  try {
    const boardId = req.board.id;

    const tasks = await Task.findAll({
      where: { boardId },
      order: [["createdAt", "ASC"]],
    });

    return res.json(tasks);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
}

async function updateTask(req, res) {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;
    const { title, description, status } = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const board = await Board.findByPk(task.boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const isOwner = board.ownerId === userId;

    let isMember = false;
    if (!isOwner) {
      const membership = await BoardUser.findOne({
        where: { boardId: board.id, userId },
      });
      isMember = !!membership;
    }

    // 403 = autenticado pero sin permisos sobre este recurso
    if (!isOwner && !isMember) {
      return res.status(403).json({ message: "No access to this board" });
    }

    // Validación simple del estado para el drag and drop del frontend
    const allowed = ["todo", "doing", "done"];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: "Error updating task", error: err.message });
  }
}

module.exports = { createTask, getBoardTasks, updateTask };
