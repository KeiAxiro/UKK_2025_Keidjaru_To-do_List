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
  const { listId, taskName, taskDate, taskTime } = req.body;
  try {
    if (!listId || !taskName || !taskDate || !taskTime) {
      setSnackbar(req, "Please fill all fields", "error");
      res.redirect("/api/components/root/contents/home");
      return;
    }
    const dueDate = new Date(`${taskDate}T${taskTime}:00.000Z`);
    const task = await prisma.task.create({
      data: { listId, title: taskName, dueDate },
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
      data: { title, isCompleted, dueDate },
    });
    res.json(task);
  } catch {
    res.status(404).json({ error: "Task not found" });
  }
});

router.put("/toggle/:id", async (req, res) => {
  const { id } = req.params;
  const { isCompleted } = req.body;

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { isCompleted: isCompleted === "true" }, // Pastikan ini boolean
  });

  res.send(`

<label class="checkbox large" x-data="{ checked: ${
    updatedTask.isCompleted
  } }" :class="{ 'overline': checked }">
    <input
  type="checkbox"
  name="isCompleted"
  ${updatedTask.isCompleted ? "checked" : ""}
  hx-put="/api/tasks/toggle/${updatedTask.id}"
  hx-vals='js:{ "isCompleted": event.target.checked }'
  hx-trigger="change"
  hx-target="#li-${updatedTask.id}"
  hx-swap="innerHTML"
/>

    <span>${updatedTask.title}</span>
  </label>
  <div class="task-action">
    <a href="#">Edit</a>
    <a href="#">Delete</a>
  </div>
  `);
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
