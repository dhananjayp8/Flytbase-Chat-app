const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.listen(8000, () => {
  console.log("Server is running!");
});
