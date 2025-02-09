import { Request, Response, NextFunction } from "express";

export const snackbar = (
  message: string,
  type: string,
  active: boolean = true
) => ({
  message,
  type,
  active,
});

export const setSnackbar = (
  req: Request,
  message: string,
  type: string,
  active: boolean = true
) => {
  (req.session as any).snackbar = { message, type, active };
};
