import { Router, Request, Response } from "express";

import authRouter from "./auth/indexAuth.js";
import listRouter from "./lists/indexList.js";
import componentRouter from "./components/indexComponents.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/lists", listRouter);
router.use("/components", componentRouter);

export default router;
