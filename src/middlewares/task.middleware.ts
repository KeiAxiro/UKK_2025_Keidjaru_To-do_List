import prisma from "../prisma/clients/indexPrisma.js";
import { setSnackbar, snackbar } from "./snackbars.middleware.js";
import { Request, Response } from "express";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { listId: req.params.listId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error });
  }
};
