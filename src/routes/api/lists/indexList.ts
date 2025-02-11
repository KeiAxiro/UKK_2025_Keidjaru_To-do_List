import {
  Router,
  Response,
  Request,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import {
  createList,
  getAllLists,
} from "../../../middlewares/list.middleware.js";
import { authenticateJWT } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticateJWT("ALL") as any, getAllLists);
router.post("/", authenticateJWT("ALL") as any, createList);
// router.post("/", getAllLists);

export default router;
