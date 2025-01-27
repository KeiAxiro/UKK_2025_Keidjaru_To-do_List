import { Response, Request } from "express";

export const loginController = (req: Request, res: Response) => {
  res.render("index", {
    title: "Login",
    vContent: "auth/login",
  });
};
