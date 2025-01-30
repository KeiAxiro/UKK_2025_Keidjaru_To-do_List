import express, { Application, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app: Application = express();
const PORT = 3000;

import apiRouter from "./routes/api/indexApi.js";
import indexRouter from "./routes/indexRouter.js";

// Middleware untuk parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware untuk parsing JSON (jika ada permintaan dalam JSON format)
app.use(express.json());

// Morgan
app.use(morgan("dev"));

//kuki
app.use(cookieParser());

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
