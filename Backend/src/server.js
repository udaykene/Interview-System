import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";

const port = 3000 || process.env.PORT;
const app = express();
const __dirname = path.resolve();

app.get("/books", (req, res) => {
  res.status(200).json({msg:"This is the root route"});
});
app.get("/health", (req, res) => {
  res.status(200).json({msg:"This is the health route"});
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "Frontend/dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
  });
}

app.listen(ENV.PORT, () => {
  console.log(`Server is listening on port:${port}`);
});
