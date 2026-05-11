import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import talentRoutes from "./routes/talentRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

export const app = express();

app.set("trust proxy", 1); // Trust the reverse proxy (Render/Vercel)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = process.env.CLIENT_URL?.split(",") || ["http://localhost:5173"];
      // Allow requests with no origin (like mobile apps or curl requests)
      // Allow specified origins
      // Allow dynamic Vercel deployments
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);
app.use(helmet());
app.use(limiter);
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(mongoSanitize());

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "SkillVerse API is healthy" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/schools", schoolRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/talents", talentRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/competitions", competitionRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/leaderboards", leaderboardRoutes);
app.use("/api/v1/certificates", certificateRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/uploads", uploadRoutes);

app.use(notFound);
app.use(errorHandler);
