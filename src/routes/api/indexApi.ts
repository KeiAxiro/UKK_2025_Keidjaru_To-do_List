import { Router, Request, Response } from "express";

import authRouter from "./auth/indexAuth.js";

const router = Router();

router.use("/auth", authRouter);

export default router;
