import express, { Application, Request, Response } from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import compression from "compression";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();
const PORT = 3000;

import apiRouter from "./routes/api/indexApi.js";
import indexRouter from "./routes/indexRouter.js";

app.use(
  compression({
    level: 9, // Default 6, bisa diatur 0-9 (9 paling optimal)
    threshold: 1024, // Hanya kompres data >1KB
  })
);

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

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate");
  next();
});

// Middleware untuk parsing JSON (jika ada permintaan dalam JSON format)
app.use(express.json());

// Morgan
app.use(morgan("dev"));

//dotenv
await import("dotenv");

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(`${__dirname}/views`));

// Middleware to serve static files
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "1d", // Cache selama 1 hari
    etag: false,
  })
);

// Snackbar
app.use((req, res, next) => {
  res.locals.snackbar = (req.session as any).snackbar || null;
  delete (req.session as any).snackbar; // Hapus setelah diteruskan ke frontend
  next();
});

// Middleware
app.use("/api", apiRouter);
app.use("/", indexRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
