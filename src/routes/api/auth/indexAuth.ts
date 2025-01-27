import { Router, Response, Request } from "express";

const router = Router();

router.get("/a", (req: Request, res: Response) => {
  console.log("asas");
  res.json({
    as: "asas",
  });
});

router.post("/login", (req: Request, res: Response) => {
  {
    const { userNameEmail, userPassword } = req.body || {};
    res.json({ userNameEmail, userPassword });
  }
});

export default router;
