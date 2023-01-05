const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const eventRoutes = require("./routes/eventRoutes");

const PORT = process.env.PORT;

const app = express();
connectDB(); // Database connection

// Middleware
app.use(express.json());
app.use(cors());
app.use(logger("dev"));

// Routes
// app.use("/api", require("./routes/api"));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/schedule", scheduleRoutes);
app.use("/api/v1/event", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
