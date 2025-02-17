import { Response, Request } from "express";
import prisma from "../prisma/clients/indexPrisma.js";
import { count } from "console";
import { setSnackbar } from "../middlewares/snackbars.middleware.js";
import { getUserListsWithTasks } from "../middlewares/list.middleware.js";

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
    const listsWithDetails = await getUserListsWithTasks(req.user.id as string);

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
};
