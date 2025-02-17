import { Router, Request, Response } from "express";
import {
  setSnackbar,
  snackbar,
} from "../../../middlewares/snackbars.middleware.js";
import prisma from "../../../prisma/clients/indexPrisma.js";
import { authenticateJWT } from "../../../middlewares/auth.middleware.js";
import {
  getListWithTasks,
  getUserListsWithTasks,
} from "../../../middlewares/list.middleware.js";
import { promises } from "dns";

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
      const listsWithDetails = await getUserListsWithTasks(
        req.user.id as string
      );

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
      const listsWithDetails = await getUserListsWithTasks(
        req.user.id as string
      );
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
router.get("/snackbars", (req: Request, res: Response) => {
  res.render("components/snackbars");
});
router.get("/register", (req: Request, res: Response) => {
  res.render("auth/register", { regUser: {} });
});
router.get("/modaladdtask/:id", async (req: Request, res: Response) => {
  try {
    // const listsWithDetails = await getListWithTasks(req.params.id as string);
    const lists = await prisma.list.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.render("components/modal_add_task", { lists });
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get(
  "/modaledit/:idlist/:idtask?",
  async (req: Request & { user?: any }, res: Response): Promise<void> => {
    const idList = req.params.idlist;
    const idTask = req.params.idtask;

    if (!idList) {
      res.status(400).send("Bad Request: Missing list ID");
      return;
    }

    try {
      // Ambil semua lists berdasarkan userId
      const listsWithDetails = await getListWithTasks(idList as string);

      let task = {};

      if (idTask) {
        // Debugging task search
        console.log("Looking for task with id:", idTask);

        // Cari task berdasarkan idTask dari listsWithDetails
        for (const list of listsWithDetails) {
          if (Array.isArray(list.tasks)) {
            // Ensure we're comparing the IDs as trimmed strings
            task = list.tasks.find((t: any) => {
              const taskId = String(t.id).trim(); // Trim in case of any extra spaces
              const idToCompare = String(idTask).trim(); // Trim in case of any extra spaces

              return taskId === idToCompare;
            });

            // If task is found, break the loop
            if (task) break;
          }
        }

        if (!task) {
          setSnackbar(req, "Task not found", "error");
          return res.redirect("/api/components/snackbars"); // Or show an appropriate message
        }
        if (task && (task as any).dueDate) {
          const dueDate = new Date((task as any).dueDate);
          const date = dueDate.toISOString().split("T")[0]; // Gets the date part (mm-dd-yyyy)
          const time = dueDate.toISOString().split("T")[1].split(".")[0]; // Gets the time part (hh:mm:ss)

          // Add date and time to the task object
          task = { ...(task as any), date, time };
        }
      }

      // Separate dueDate into date and time

      // ✅ Render with the correct data
      res.render("components/modal_edit", { lists: listsWithDetails, task });
    } catch (error) {
      console.error("Error fetching lists:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get(
  "/modalconfirm/:idlist/:idtask?",
  async (req: Request & { user?: any }, res: Response): Promise<void> => {
    const idList = req.params.idlist;
    const idTask = req.params.idtask;

    if (!idList) {
      res.status(400).send("Bad Request: Missing list ID");
      return;
    }

    try {
      // Ambil semua lists berdasarkan userId
      const listsWithDetails = await getListWithTasks(idList as string);

      let task = {};

      if (idTask) {
        // Debugging task search
        console.log("Looking for task with id:", idTask);

        // Cari task berdasarkan idTask dari listsWithDetails
        for (const list of listsWithDetails) {
          if (Array.isArray(list.tasks)) {
            // Ensure we're comparing the IDs as trimmed strings
            task = list.tasks.find((t: any) => {
              const taskId = String(t.id).trim(); // Trim in case of any extra spaces
              const idToCompare = String(idTask).trim(); // Trim in case of any extra spaces

              return taskId === idToCompare;
            });

            // If task is found, break the loop
            if (task) break;
          }
        }

        if (!task) {
          setSnackbar(req, "Task not found", "error");
          return res.redirect("/api/components/snackbars"); // Or show an appropriate message
        }
        if (task && (task as any).dueDate) {
          const dueDate = new Date((task as any).dueDate);
          const date = dueDate.toISOString().split("T")[0]; // Gets the date part (mm-dd-yyyy)
          const time = dueDate.toISOString().split("T")[1].split(".")[0]; // Gets the time part (hh:mm:ss)

          // Add date and time to the task object
          task = { ...(task as any), date, time };
        }
      }

      // Separate dueDate into date and time

      // ✅ Render with the correct data
      res.render("components/modal_confirm", { lists: listsWithDetails, task });
    } catch (error) {
      console.error("Error fetching lists:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/modaladd", (req: Request, res: Response) => {
  res.render("components/modal_add", { regUser: {} });
});

router.get(
  "/task/:id",
  authenticateJWT("ALL"),
  async (req: Request, res: Response) => {
    try {
      const lists = await getListWithTasks(req.params.id);
      // Separate tasks from lists
      const tasks = lists.reduce((allTasks: any[], list) => {
        if (Array.isArray(list.tasks)) {
          allTasks.push(...list.tasks);
        }
        return allTasks;
      }, []);

      console.log("Lists:", lists);
      console.log("Tasks:", tasks);

      res.render("components/task", {
        lists,
        tasks,
      });
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
