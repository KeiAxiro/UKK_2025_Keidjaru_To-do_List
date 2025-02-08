import { Response, Request } from "express";

export const homeController = (
  req: Request & { user?: any },
  res: Response
) => {
  const token = req.cookies.token || false;
  console.log(req.user);
  if (!token) res.redirect("/login");
  res.render("index", {
    title: "wow",
    vContent: "contents/home",
    user: req.user,
  });
};
