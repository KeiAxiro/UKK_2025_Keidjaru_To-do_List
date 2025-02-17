import {
  Router,
  Response,
  Request,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import {
  createList,
  deleteList,
  getAllLists,
  updateList,
} from "../../../middlewares/list.middleware.js";
import { authenticateJWT } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticateJWT("ALL") as any, getAllLists);
router.post("/", authenticateJWT("ALL") as any, createList);
router.post("/:id", authenticateJWT("ALL") as any, updateList);
router.get("/delete", authenticateJWT("ALL") as any, deleteList);
// router.post("/", getAllLists);

export default router;
