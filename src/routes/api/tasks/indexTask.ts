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
    console.log(taskDate, taskTime, dueDate);
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
router.post("/:id", authenticateJWT("ALL"), async (req, res) => {
  const { taskName, taskDate, taskTime } = req.body;
  const { id } = req.params;

  console.log(taskName, taskDate, taskTime);
  // Check if the necessary fields are present
  if (!id || !taskName || !taskDate || !taskTime) {
    setSnackbar(req, "Please fill all fields", "error");
    res.redirect("/api/components/root/contents/home");
    return;
  }

  // Create the dueDate from taskDate and taskTime
  const dueDate = new Date(`${taskDate}T${taskTime}`);
  console.log(taskDate, taskTime, dueDate);
  try {
    if (id) {
      // Update task if id is provided
      const task = await prisma.task.update({
        where: { id },
        data: { title: taskName, dueDate },
      });

      setSnackbar(req, "Task Updated Successfully!", "primary");
      res.redirect("/api/components/root/contents/home");
    } else {
      setSnackbar(req, "Task not found", "error");
      res.redirect("/api/components/root/contents/home");
    }
  } catch (error) {
    console.error(error);
    setSnackbar(req, "Failed to save task", "error");
    res.redirect("/api/components/root/contents/home");
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

<header class="no-padding task-body">
  <nav x-data="{ checked: ${
    updatedTask.isCompleted
  }}" style="gap: 0.3rem; margin-right: 0.4rem;" class="no-space">
    <label class="checkbox left-margin">
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
      <span></span>
    </label>
    
    <span class="small-line max tiny-margin " :class="{ 'overline': checked }">${
      updatedTask.title
    }</span>
    
    <button class="circle transparent" hx-get="/api/components/modaledit/${
      updatedTask.listId
    }/${updatedTask.id}" hx-target="#div-modalEdit" hx-swap="innerHTML"
        hx-indicator="#indicator-bar"
        @click="$nextTick(() => { isModalEdit = true; activeModalTab = 'task'; })">
      <i>edit_square</i>
    </button>
    <button class="circle transparent">
      <i>delete</i>
    </button>
  </nav>
</header>

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
