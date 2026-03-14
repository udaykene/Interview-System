import express from "express";
import http from "http";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import rateLimit from "express-rate-limit";
import { Server as SocketIOServer } from "socket.io";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import passport from "./lib/passport.js";
import problemRoutes from "./routes/problemRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";
import jwt from "jsonwebtoken";
import Session from "./models/Sessions.js";

const app = express();
const server = http.createServer(app);
const __dirname = path.resolve();
const isProd = ENV.NODE_ENV === "production";

// ─── Middleware ─────────────────────────────────
app.use(express.json({ limit: "5mb" })); // allow base64 profile images
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.startsWith("/api/auth"),
  })
);
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);
app.use(
  session({
    secret: ENV.SESSION_SECRET || (isProd ? null : "dev-session-secret"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: 1000 * 60 * 10,
    },
  })
);
app.use(passport.initialize());

// ─── HTTP Routes ────────────────────────────────
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/execute", executeRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "OK" });
});

// ─── Socket.IO – Collaborative Code Editor ──────
const io = new SocketIOServer(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});

// Auth middleware for Socket
io.use((socket, next) => {
  try {
    // Accept token from cookie OR query param (for browser clients)
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("Unauthorized"));
    const payload = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
    socket.userId = payload.sub;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id} (user: ${socket.userId})`);

  // Join a session room
  socket.on("join-session", ({ sessionId }) => {
    socket.join(sessionId);
    console.log(`User ${socket.userId} joined session room: ${sessionId}`);
  });

  // Broadcast code changes to other participants
  socket.on("code-change", async ({ sessionId, code, language }) => {
    socket.to(sessionId).emit("code-update", { code, language, from: socket.userId });
    // Persist shared code to DB (debounce on client side)
    try {
      await Session.findByIdAndUpdate(sessionId, {
        $set: { [`sharedCode.${language}`]: code, selectedLanguage: language },
      });
    } catch {
      // non-critical
    }
  });

  // Broadcast language selection change
  socket.on("language-change", ({ sessionId, language }) => {
    socket.to(sessionId).emit("language-update", { language, from: socket.userId });
  });

  // Typing indicator
  socket.on("typing", ({ sessionId }) => {
    socket.to(sessionId).emit("user-typing", { userId: socket.userId });
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ─── Production Static Serve ─────────────────────
if (isProd) {
  app.use(express.static(path.join(__dirname, "../Frontend", "dist")));
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

// ─── Start Server ────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    server.listen(ENV.PORT, () =>
      console.log(`🚀 Server listening on port:${ENV.PORT}`)
    );
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();
