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
