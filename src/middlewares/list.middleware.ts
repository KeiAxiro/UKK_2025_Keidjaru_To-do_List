import prisma from "../prisma/clients/indexPrisma.js";
import { setSnackbar, snackbar } from "./snackbars.middleware.js";
import { Request, Response } from "express";

export const getAllLists = async (req: Request, res: Response) => {
  console.log((req as any).user);
  try {
    const lists = await prisma.list.findMany({
      where: { userId: (req as any).user.id },
    });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const createList = async (req: Request, res: Response) => {
  const { listName, listDescription } = req.body;
  try {
    if (!listName || !listDescription) {
      setSnackbar(req, "Please fill all fields", "error");
      res.redirect("/api/components/root/contents/home");
      return;
    }
    const newList = await prisma.list.create({
      data: {
        userId: (req as any).user.id,
        name: listName,
        description: listDescription,
      },
    });
    console.log(listName, listDescription);
    setSnackbar(req, "Success Create New List!", "primary");
    res.redirect("/api/components/root/contents/home");
  } catch (error) {
    console.log(error, listName, listDescription);

    res.status(500).json({ error });
  }
};
