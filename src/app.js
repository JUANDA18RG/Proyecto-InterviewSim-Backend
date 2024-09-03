import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import usuario from "./routes/auth.routes.js"; 
import interview from "./routes/interwiew.routes.js";
import dotenv from "dotenv";

dotenv.config();


const app = express();

app.use(
  cors({
    credentials: true,
    origin:"http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api", usuario);
app.use("/interwiew", interview);



export default app;