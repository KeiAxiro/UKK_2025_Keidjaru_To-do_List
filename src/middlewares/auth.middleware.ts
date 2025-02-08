import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/clients/indexPrisma.js";
import { snackbar } from "./snackbars.middleware.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const loginAuth = async (req: Request, res: Response) => {
  const { userNameEmail, userPassword, remember } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: userNameEmail }, { email: userNameEmail }],
      },
    });

    if (!user || !(await bcrypt.compare(userPassword, user.password))) {
      console.log("invalid username or password");

      (req.session as any).snackbar = snackbar(
        `Invalid Username Or Password!`,
        "error"
      );
      res.redirect("/login");
      return;
    }

    const token = jwt.sign(
      { id: user.id, nama: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: remember ? 10 * 24 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000, // 10 days or 4 hours
    });

    if (remember) {
      res.cookie("remember_email", userNameEmail, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
      });
    }

    //   setAlertMessage(
    //     res,
    //     "Login Successful!",
    //     `Welcome back, ${user.nama}!`,
    //     "success"
    //   );
    // res.render("components/snackbars", {
    //   snackbar: snackbar(`Login Successfull!`, "primary"),
    // });

    (req.session as any).snackbar = snackbar(`Login Successfull!`, "primary");

    res.redirect("/");
    return;
  } catch (err) {
    //   setAlertMessage(res, "Login Failed!", `Error: ${error.message}`, "error");
    if (err instanceof Error) {
      res.json(err.message);
    }
  }
};

export const logoutAuth = (req: Request, res: Response) => {
  console.log("remember_email: " + req.cookies.remember_email);

  res.clearCookie("token"); // Remove token cookie
  // setAlertMessage(res, "Logout Successful!", "Have a nice day ^_^", "success");

  (req.session as any).snackbar = snackbar(`Logout Successful!`, "secondary");
  res.redirect("/login");
};

export const authenticateJWT = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token; // Ambil token dari cookie

    if (requiredRole === "ALL") {
      if (!token) {
        return next(); // Lanjutkan tanpa verifikasi
      }
    } else {
      if (!token) {
        return res
          .status(403)
          .json({ message: "Access denied. No token provided." });
      }
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token." });
      }

      (req as any).user = user;

      if (
        requiredRole &&
        requiredRole !== "ALL" &&
        user.role !== requiredRole
      ) {
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient role." });
      }

      next(); // Jika lolos semua validasi, lanjutkan
    });
  };
};
