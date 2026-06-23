
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const Log = require("./services/logger");

const app = express();

app.use(cors());
app.use(express.json());

//test routes
app.get("/", (req, res) => {
  res.json({
    message: "Logging middleware is running"
  });
});

app.get("/test-log", async (req, res) => {
  const result = await Log(
    "backend",
    "info",
    "service",
    "Logger test successful"
  );

  if (!result) {
    return res.status(500).json({
      message: "Failed to create log"
    });
  }

  res.json(result);
});

//start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Logging middleware running on port ${PORT}`
  );
});