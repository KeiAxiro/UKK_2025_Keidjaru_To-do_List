import { Router, Request, Response } from "express";
import { homeController } from "../controllers/home.controller";

const router = Router();

router.get("/", homeController);
router.get("/lorem", (req: Request, res: Response) => {
  res.render("contents/lorem");
});
router.get("/hai", (req: Request, res: Response) => {
  res.render("contents/hai");
});
router.get("/tes", (req: Request, res: Response) => {
  res.render("tes");
});
export default router;
