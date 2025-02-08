import { Router, Request, Response, RequestHandler } from "express";
import { homeController } from "../controllers/home.controller.js";
import { loginController } from "../controllers/auth.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.get(
  "/",
  authenticateJWT("ALL") as unknown as RequestHandler,
  homeController
);

router.get("/login", loginController);

router.get("/login", loginController);

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
