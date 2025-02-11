import { Router, Request, Response } from "express";
import { snackbar } from "../../../middlewares/snackbars.middleware.js";

const router = Router();

router.get("/home", (req: Request, res: Response) => {
res.render("contents/home");
});
router.get("/login", (req: Request, res: Response) => {
res.render("auth/login");
});
router.get("/register", (req: Request, res: Response) => {
res.render("auth/register",{regUser: {}});
});
router.get("/modaladd", (req: Request, res: Response) => {
res.render("components/modal_add",{regUser: {}});
});

export default router;
