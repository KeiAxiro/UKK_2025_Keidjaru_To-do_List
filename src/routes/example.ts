import { Router, Request, Response } from "express";

const router = Router();

router.get("/example", (req: Request, res: Response) => {
  res.json({ message: "This is an example route" });
});

export default router;
