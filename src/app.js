import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import usuario from "./routes/auth.routes.js"; 
import interview from "./routes/interwiew.routes.js";
import dotenv from "dotenv";
import compression from "compression";
import path from "path";

dotenv.config();

const app = express();
app.use(compression());
app.use(
  cors({
    origin: "*" || "https://proyecto-interviewsim.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Asegúrate de que las rutas estén correctamente configuradas en los archivos auth.routes.js e interwiew.routes.js
app.use("/api", usuario);
app.use("/interview", interview);

// Sirve archivos estáticos si estás usando una aplicación frontend como React
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;