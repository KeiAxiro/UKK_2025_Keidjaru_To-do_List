import {
  Router,
  Response,
  Request,
  NextFunction,
  ErrorRequestHandler,
} from "express";

import { authenticateJWT } from "../../../middlewares/auth.middleware.js";
import prisma from "../../../prisma/clients/indexPrisma.js";
import { setSnackbar } from "../../../middlewares/snackbars.middleware.js";

const router = Router();

router.post("/", authenticateJWT("ALL"), async (req, res) => {
  const { listId, taskName, taskDescription, taskDate, taskTime } = req.body;
  try {
    const dueDate = new Date(`${taskDate}T${taskTime}:00.000Z`);
    const task = await prisma.task.create({
      data: { listId, title: taskName, description: taskDescription, dueDate },
    });
    setSnackbar(req, "Task Created Successfully!", "primary");
    res.redirect("/api/components/root/contents/home");
  } catch {
    setSnackbar(req, "Failed to create task", "error");
    res.redirect("/api/components/root/contents/home");
  }
});

// Read All Tasks
router.get("/", async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

// Read Single Task
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const task = await prisma.task.findUnique({ where: { id } });
  task ? res.json(task) : res.status(404).json({ error: "Task not found" });
});

// Update Task
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, isCompleted, dueDate } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { title, description, isCompleted, dueDate },
    });
    res.json(task);
  } catch {
    res.status(404).json({ error: "Task not found" });
  }
});

router.get("/ch/:id", async (req, res) => {
  const { id } = req.params;
  const { isCompleted } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { isCompleted },
    });
    res.json(task);
  } catch {
    res.status(404).json({ error: "Task not found" });
  }
});

// Delete Task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted" });
  } catch {
    res.status(404).json({ error: "Task not found" });
  }
});

export default router;
