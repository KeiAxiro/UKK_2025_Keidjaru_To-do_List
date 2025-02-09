import { Response, Request } from "express";
import session from "express-session";

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

export const registerController = (
  req: Request & { user?: any },
  res: Response
) => {
  const token = req.cookies.token || false;
  const regUser = (req.session as any).user || false;
  delete (req.session as any).user;
  const user = req.user || false;

  if (token) res.redirect("/");
  res.render("index", {
    title: "Register",
    vContent: "auth/register",
    user,
    regUser,
  });
};
