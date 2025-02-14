import { Response, Request } from "express";
import prisma from "../prisma/clients/indexPrisma.js";
import { count } from "console";
import { setSnackbar } from "../middlewares/snackbars.middleware.js";

export const homeController = async (
  req: Request & { user?: any },
  res: Response
) => {
  // Cek apakah user punya token
  const token = req.cookies.token || false;
  if (!token) return res.redirect("/login");

  // Pastikan user ada sebelum query ke database
  if (!req.user || !req.user.id) {
    return res.status(401).send("Unauthorized");
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

    // Gabungkan data list dengan jumlah task
    const listsWithTaskCounts = lists.map((list) => ({
      ...list,
      taskCount: taskCountMap[list.id] || 0, // Jika tidak ada task, default 0
    }));

    // Render ke frontend
    res.render("index", {
      title: "Home",
      vContent: "contents/home",
      user: req.user,
      lists: listsWithTaskCounts, // Pastikan lists yang dikirim sudah ada taskCount-nya
    });
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).send("Internal Server Error");
  }
};
