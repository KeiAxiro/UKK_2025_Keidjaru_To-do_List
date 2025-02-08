import { Router, Response, Request, NextFunction } from "express";
import { loginAuth, logoutAuth } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", loginAuth);
router.get("/logout", logoutAuth);

export default router;
