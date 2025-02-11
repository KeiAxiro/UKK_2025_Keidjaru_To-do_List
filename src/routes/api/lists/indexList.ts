import { Router, Response, Request, NextFunction, ErrorRequestHandler } from "express";
import { getAllLists } from "../../../middlewares/list.middleware.js";
import { authenticateJWT } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.get("/",authenticateJWT("ALL") as any,  getAllLists);
router.post("/", getAllLists);
router.post("/", getAllLists);

export default router;
