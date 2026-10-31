import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";

import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { razorpayWebhook } from "./controllers/paymentController.js";

const app = express();

app.set("trust proxy", 1); // behind Render/Railway/Nginx so rate-limit sees real IPs
app.disable("x-powered-by");

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigins,
    credentials: true, // allow the auth cookie
  })
);
app.use(compression());
if (!env.isProd) app.use(morgan("dev"));

// Razorpay webhook needs the RAW body to verify its signature,
// so it must be mounted BEFORE express.json().
app.post("/api/payment/webhook", express.raw({ type: "application/json" }), razorpayWebhook);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
    uptime: Math.round(process.uptime()),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api", apiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
