import { Router, Response, Request, NextFunction } from "express";
import { loginAuth } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", loginAuth);

export default router;
