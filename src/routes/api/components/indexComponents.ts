import { Router, Request, Response } from "express";
import { snackbar } from "../../../middlewares/snackbars.middleware.js";
import prisma from "../../../prisma/clients/indexPrisma.js";
import { authenticateJWT } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/home",
  authenticateJWT("ALL"),
  async (req: Request, res: Response) => {
    const lists = await prisma.list.findMany({
      where: {
        userId: (req as any).user.id,
      },
    });
    res.render("contents/home", {
      lists,
    });
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
