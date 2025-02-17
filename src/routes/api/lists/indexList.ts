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
  updateList,
} from "../../../middlewares/list.middleware.js";
import { authenticateJWT } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticateJWT("ALL") as any, getAllLists);
router.post("/", authenticateJWT("ALL") as any, createList);
router.post("/:id", authenticateJWT("ALL") as any, updateList);
router.delete("/:id", authenticateJWT("ALL") as any, updateList);
// router.post("/", getAllLists);

export default router;
