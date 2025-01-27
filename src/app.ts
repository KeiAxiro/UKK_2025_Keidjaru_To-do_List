import express, { Application, Request, Response } from "express";
import path from "path";
import morgan from "morgan";

const app: Application = express();
const PORT = 3000;

import apiRouter from "./routes/api/indexApi.js";
import indexRouter from "./routes/indexRouter.js";

// Morgan
app.use(morgan("dev"));

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
