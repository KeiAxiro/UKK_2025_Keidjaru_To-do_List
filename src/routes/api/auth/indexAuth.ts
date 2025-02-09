import { Router, Response, Request, NextFunction } from "express";
import {
  loginAuth,
  logoutAuth,
  registerAuth,
} from "../../../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", loginAuth);
router.post("/register", registerAuth);
router.get("/logout", logoutAuth);

export default router;
