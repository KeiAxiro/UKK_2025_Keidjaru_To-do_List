import { Response, Request } from "express";

export const loginController = (
  req: Request & { user?: any },
  res: Response
) => {
  const token = req.cookies.token || false;

  if (token) res.redirect("/");
  res.render("index", {
    title: "Login",
    vContent: "auth/login",
    user: req.user,
  });
};
