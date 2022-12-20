const express = require("express");
const logger = require("morgan");
const { connectToDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const PORT = 1338;

const app = express();
connectToDB();

app.use(express.json());
app.use(logger("dev"));
express.static("Content");

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);

app.get("/", async (_req, res) => {
  return res.status(200).send("API works");
});

app.listen(PORT, () => {
  console.log(`Server is running at port:${PORT}`);
});
