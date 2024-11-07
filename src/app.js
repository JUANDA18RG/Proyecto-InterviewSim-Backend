import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import usuario from "./routes/auth.routes.js"; 
import interview from "./routes/interwiew.routes.js";
import dotenv from "dotenv";
import compression from "compression";

dotenv.config();

const app = express();
app.use(compression());
app.use(
  cors({
    origin: process.env.PERMISSION_FRONTEND,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Asegúrate de que las rutas estén correctamente configuradas en los archivos auth.routes.js e interwiew.routes.js
app.use("/api", usuario);
app.use("/interwiew", interview);

export default app;