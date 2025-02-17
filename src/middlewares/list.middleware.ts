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
    if (!listName) {
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

export const updateList = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { listName, listDescription } = req.body;
  try {
    const list = await prisma.list.update({
      where: { id: id },
      data: { name: listName, description: listDescription },
    });
    setSnackbar(req, "List Updated Successfully!", "primary");
    res.redirect("/api/components/root/contents/home");
  } catch (error) {
    setSnackbar(req, "Failed to update list", "error");
    res.redirect("/api/components/root/contents/home");
  }
};

export const deleteList = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.list.delete({ where: { id } });
    setSnackbar(req, "List Deleted Successfully!", "primary");
    res.redirect("/api/components/root/contents/home");
  } catch (error) {
    setSnackbar(req, "Failed to delete list", "error");
    res.redirect("/api/components/root/contents/home");
  }
};

export const getUserListsWithTasks = async (userId: string) => {
  if (!userId) throw new Error("User ID is required");

  const lists = await prisma.list.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const taskCounts = await prisma.task.groupBy({
    by: ["listId"],
    _count: { id: true },
  });

  const taskCountMap = taskCounts.reduce(
    (acc, item) => ({ ...acc, [item.listId]: item._count.id }),
    {} as Record<number, number>
  );

  const tasks = await prisma.task.findMany({
    where: { listId: { in: lists.map((list) => list.id) } },
  });

  const taskMap = tasks.reduce((acc, task) => {
    if (!acc[task.listId]) acc[task.listId] = [];
    acc[task.listId].push(task);
    return acc;
  }, {} as Record<number, typeof tasks>);

  return lists.map((list) => ({
    ...list,
    taskCount: taskCountMap[list.id] || 0,
    tasks: taskMap[list.id] || [],
  }));
};

export const getListWithTasks = async (listId: string) => {
  if (!listId) throw new Error("List ID is required");

  const lists = await prisma.list.findMany({
    where: { id: listId },
    orderBy: { updatedAt: "desc" },
  });

  if (lists.length === 0) throw new Error("List not found");

  const taskCounts = await prisma.task.groupBy({
    by: ["listId"],
    _count: { id: true },
  });

  const taskCountMap = taskCounts.reduce(
    (acc, item) => ({ ...acc, [item.listId]: item._count.id }),
    {} as Record<number, number>
  );

  const tasks = await prisma.task.findMany({
    where: { listId: { in: lists.map((list) => list.id) } },
  });

  const taskMap = tasks.reduce((acc, task) => {
    if (!acc[task.listId]) acc[task.listId] = [];
    acc[task.listId].push(task);
    return acc;
  }, {} as Record<number, typeof tasks>);

  const listsWithDetails = lists.map((list) => ({
    ...list,
    taskCount: taskCountMap[list.id] || 0,
    tasks: taskMap[list.id] || [],
  }));

  return listsWithDetails;
};
