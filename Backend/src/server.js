import express from "express";
import path from "path";
import cors from "cors";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express"; // this adds auth feild to req object : req.auth()
import { functions, inngest } from "./lib/inngest.js";
import sessionRoutes from './routes/sessionRoutes.js'

import chatRoutes from "./routes/chatRoutes.js"; // this is a route for chat
const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    //Credentials measn => Server allows a browser to store cookies on req
    credentials: true,
  }),
);
app.use(clerkMiddleware()); // this adds auth feild to req object : req.auth()
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes); // this is a route for chat
app.use("/api/sessions", sessionRoutes); // this is a route for chat

// This route is to check if the server is running
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "This is the health route" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend", "dist")));

  // Catch-all: serve index.html for any route not starting with /api or /books or /health
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log(`Server is listening on port:${ENV.PORT}`),
    );
  } catch (error) {
    console.error("❌Error in starting the server", error);
  }
};

startServer();
