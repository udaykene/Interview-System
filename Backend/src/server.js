import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import connectDB from "./lib/db.js";
import { start } from "repl";

const app = express();
const __dirname = path.resolve();

app.get("/books", (req, res) => {
  res.status(200).json({ msg: "This is the books route" });
});
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
