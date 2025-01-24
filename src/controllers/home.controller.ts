import { Response, Request } from "express";

export const homeController = (req: Request, res: Response) => {
  res.render("index", {
    title: "wow",
  });
};
