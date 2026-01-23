
import express from "express";
import { ENV } from "./lib/env.js";

const port = 3000 || process.env.PORT;
const app = express();

console.log(ENV.PORT);
console.log(ENV.DB_URL);


app.get("/", (req, res) => {
    res.send("This is the root route");
});

app.listen(ENV.PORT, () => {
  console.log(`Server is listening on port:${port}`);
});
