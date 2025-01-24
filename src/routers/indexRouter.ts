import { Router, Request, Response } from "express";
import { homeController } from "../controllers/home.controller";

const router = Router();

router.get("/", homeController);
router.get("/lorem", (req: Request, res: Response) => {
  res.render("lorem");
});
export default router;
