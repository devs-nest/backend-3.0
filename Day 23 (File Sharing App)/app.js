const express = require("express");
const scheduler = require("node-cron");
const path = require("path");
const connectDB = require("./config/db");
const { fetchAndDeleteData } = require("./services/fileCleaner");
require("dotenv").config;

const PORT = process.env.PORT;
const app = express();
connectDB();

scheduler.schedule("00 12 * * *", () => fetchAndDeleteData());

// Templating Engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Middlewares
app.use(express.json());
if (process.env.NODE_ENV === "DEV") {
  const morgan = require("morgan");
  app.use(morgan("tiny"));
}

// Routes
app.use("/api/files", require("./routes/files"));
app.use("/api/pages", require("./routes/pages"));

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
