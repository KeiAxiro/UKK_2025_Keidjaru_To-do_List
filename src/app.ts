import express, { Application, Request, Response } from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();
const PORT = 3000;

import apiRouter from "./routes/api/indexApi.js";
import indexRouter from "./routes/indexRouter.js";

// Middleware untuk parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));
//kuki
app.use(cookieParser());
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Middleware untuk parsing JSON (jika ada permintaan dalam JSON format)
app.use(express.json());

// Morgan
app.use(morgan("dev"));

//dotenv
import("dotenv");

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(`${__dirname}/views`));
console.log("Views directory:", path.join(__dirname, "views"));
// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use("/api", apiRouter);
app.use("/", indexRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
