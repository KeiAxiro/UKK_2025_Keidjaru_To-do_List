import { Router, Request, Response } from "express";
import { snackbar } from "../../../middlewares/snackbars.middleware.js";
import prisma from "../../../prisma/clients/indexPrisma.js";
import { authenticateJWT } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/root/*",
  authenticateJWT("ALL"),
  async (req: Request & { user?: any }, res: Response): Promise<void> => {
    const view = req.params[0];
    const token = req.cookies.token || false;
    if (!token)
      return res.render("index", {
        title: "Home",
        vContent: view,
        user: req.user,
        regUser: (req.session as any).user,
      });

    // Pastikan user ada sebelum query ke database
    if (!req.user || !req.user.id) {
      return res.status(401).send("Unauthorized") as any;
    }

    try {
      // Ambil semua lists berdasarkan userId
      const lists = await prisma.list.findMany({
        where: {
          userId: req.user.id,
        },
      });

      // Ambil jumlah task per list dengan groupBy (lebih cepat dari Promise.all)
      const taskCounts = await prisma.task.groupBy({
        by: ["listId"],
        _count: { id: true },
      });

      // Buat mapping dari listId ke jumlah task
      const taskCountMap = taskCounts.reduce((acc, item) => {
        acc[item.listId] = item._count.id;
        return acc;
      }, {} as Record<number, number>);

      // Ambil semua task berdasarkan listId yang ada
      const tasks = await prisma.task.findMany({
        where: {
          listId: { in: lists.map((list) => list.id) },
        },
      });

      // Buat mapping listId ke array task
      const taskMap = tasks.reduce((acc, task) => {
        if (!acc[task.listId]) acc[task.listId] = [];
        acc[task.listId].push(task);
        return acc;
      }, {} as Record<number, typeof tasks>);

      // Gabungkan data list dengan jumlah task dan isi task
      const listsWithDetails = lists.map((list) => ({
        ...list,
        taskCount: taskCountMap[list.id] || 0, // Jika tidak ada task, default 0
        tasks: taskMap[list.id] || [], // Jika tidak ada task, default array kosong
      }));

      // Urutkan berdasarkan banyaknya task (descending)
      listsWithDetails.sort((a, b) => b.taskCount - a.taskCount);

      // Render ke frontend
      res.render("index", {
        title: "Home",
        vContent: "contents/home",
        user: req.user,
        lists: listsWithDetails, // Pastikan lists sudah terurut dan berisi task
      });
    } catch (error) {
      console.error("Error fetching lists:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);
router.get(
  "/home",
  authenticateJWT("ALL"),
  async (req: Request & { user?: any }, res: Response) => {
    try {
      // Ambil semua lists berdasarkan userId
      const lists = await prisma.list.findMany({
        where: {
          userId: req.user.id,
        },
      });

      // Ambil jumlah task per list dengan groupBy (lebih cepat dari Promise.all)
      const taskCounts = await prisma.task.groupBy({
        by: ["listId"],
        _count: { id: true },
      });

      // Buat mapping dari listId ke jumlah task
      const taskCountMap = taskCounts.reduce((acc, item) => {
        acc[item.listId] = item._count.id;
        return acc;
      }, {} as Record<number, number>);

      // Ambil semua task berdasarkan listId yang ada
      const tasks = await prisma.task.findMany({
        where: {
          listId: { in: lists.map((list) => list.id) },
        },
      });

      // Buat mapping listId ke array task
      const taskMap = tasks.reduce((acc, task) => {
        if (!acc[task.listId]) acc[task.listId] = [];
        acc[task.listId].push(task);
        return acc;
      }, {} as Record<number, typeof tasks>);

      // Gabungkan data list dengan jumlah task dan isi task
      const listsWithDetails = lists.map((list) => ({
        ...list,
        taskCount: taskCountMap[list.id] || 0, // Jika tidak ada task, default 0
        tasks: taskMap[list.id] || [], // Jika tidak ada task, default array kosong
      }));

      // Urutkan berdasarkan banyaknya task (descending)
      listsWithDetails.sort((a, b) => b.taskCount - a.taskCount);

      // Render ke frontend
      res.render("contents/home", {
        lists: listsWithDetails, // Pastikan lists sudah terurut dan berisi task
      });
    } catch (error) {
      console.error("Error fetching lists:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/login", (req: Request, res: Response) => {
  res.render("auth/login");
});
router.get("/register", (req: Request, res: Response) => {
  res.render("auth/register", { regUser: {} });
});
router.get("/modaladd", (req: Request, res: Response) => {
  res.render("components/modal_add", { regUser: {} });
});
router.get(
  "/task/:id",
  authenticateJWT("ALL"),
  async (req: Request, res: Response) => {
    const lists = await prisma.list.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.render("components/task", {
      lists,
    });
  }
);

export default router;
