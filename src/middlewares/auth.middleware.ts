import {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
  RequestHandler,
} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/clients/indexPrisma.js";
import { setSnackbar, snackbar } from "./snackbars.middleware.js";

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

      setSnackbar(req, `Invalid username or password`, "error");
      res.redirect("/api/components/root/login");
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

    setSnackbar(req, `Login Successfully!`, "primary");

    res.redirect("/api/components/root/contents/home");
    return;
  } catch (err) {
    if (err instanceof Error) {
      res.json(err.message);
    }
  }
};

export const registerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userName, userEmail, userPassword, userConfirmPassword } = req.body;
  console.log(userName, userEmail, userPassword, userConfirmPassword);
  const regUser = {
    userName,
    userEmail,
    userPassword,
    userConfirmPassword,
  };
  (req.session as any).user = regUser;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
    setSnackbar(req, `Invalid email format: ${userEmail}`, "error");
    (req.session as any).snackbar = snackbar(`Invalid email format!`, "error");
    return res.redirect("/api/components/root/auth/register");
  }
  if (userPassword !== userConfirmPassword) {
    (req.session as any).snackbar = snackbar(
      `Passwords do not match!`,
      "error"
    );
    return res.redirect("/api/components/root/auth/register");
    return;
  }

  try {
    const hashPassword = await bcrypt.hash(userConfirmPassword, 10);
    await prisma.user.create({
      data: {
        username: userName,
        email: userEmail,
        password: hashPassword,
      },
    });
    (req.session as any).snackbar = snackbar(
      `User created successfully`,
      "green"
    );
    res.redirect("/api/components/root/auth/login");
  } catch (error: any) {
    if (error.code === "P2002") {
      (req.session as any).snackbar = snackbar(
        `Account already exists`,
        "error"
      );
      return res.redirect("/api/components/root/auth/register");
    }
    (req.session as any).snackbar = snackbar(`Error: ${error}`, "error");
    return res.redirect("/api/components/root/auth/register");
  }
};

export const logoutAuth = (req: Request, res: Response) => {
  console.log("remember_email: " + req.cookies.remember_email);

  res.clearCookie("token"); // Remove token cookie

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
        setSnackbar(req, " Access Denied. No token provided.", "error");
        return res.render("index", {
          title: "Invalid",
          user: {},
          vContent: "auth/login",
        });
      }
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        setSnackbar(req, "Invalid token.", "error");
        return res.render("index", {
          title: "Invalid",
          user: {},
          vContent: "auth/login",
        });
      }

      (req as any).user = user;

      if (
        requiredRole &&
        requiredRole !== "ALL" &&
        user.role !== requiredRole
      ) {
        setSnackbar(req, "Access denied. Insufficient role", "error");
        return res.render("index", {
          title: "Invalid",
          user: {},
          vContent: "auth/login",
        });
      }

      next(); // Jika lolos semua validasi, lanjutkan
    });
  };
};
