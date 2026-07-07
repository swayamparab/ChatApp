import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRouter from './modules/health/health.route'
import authRouter from "./modules/auth/auth.routes"
import chatRequestRoutes from "./modules/chat-request/chat-request.routes"

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/health", healthRouter);

app.use("/api/auth", authRouter);

app.use("/api/chat-requests", chatRequestRoutes)

export default app;