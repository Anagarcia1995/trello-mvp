const { Task } = require("../../models");

// req.board viene del middleware boardAccessMiddleware (validó permisos)
async function createTask(req, res) {
  try {
    const boardId = req.board.id;
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() ? description.trim() : null,
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

// req.task viene del middleware taskAccessMiddleware (validó permisos)
async function updateTask(req, res) {
  try {
    const task = req.task;
    const { title, description, status } = req.body;

    // Estados permitidos para el DnD del frontend
    const allowed = ["todo", "doing", "done"];
    if (status !== undefined && !allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (title !== undefined) {
      const t = String(title).trim();
      if (!t) return res.status(400).json({ message: "title cannot be empty" });
      task.title = t;
    }

    if (description !== undefined) {
      const d = String(description || "").trim();
      task.description = d ? d : null;
    }

    if (status !== undefined) task.status = status;

    await task.save();

    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: "Error updating task", error: err.message });
  }
}

module.exports = { createTask, getBoardTasks, updateTask };
