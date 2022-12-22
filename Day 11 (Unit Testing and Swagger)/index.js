const express = require("express");
const logger = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const { connectToDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

require("dotenv").config();

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Photo/Video Store API",
      version: "1.0.0",
      description:
        "Completed project with file upload, payment gateway, unit testing and swagger docs",
    },
    servers: [
      {
        url: BASE_URL,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();
connectToDB();

app.use(express.json());
app.use(logger("dev"));
express.static("Content");

// Routes
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.get("/", async (_req, res) => {
  return res.status(200).send("API works");
});

app.get("/", async (_req, res) => {
  return res.status(200).send("API works");
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
