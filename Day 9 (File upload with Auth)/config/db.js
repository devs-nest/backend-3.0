const { Sequelize } = require("sequelize");

//* Instantiates sequelize with the name of database, username, password and configuration options
const createDB = new Sequelize("test-db", "user", "pass", {
  dialect: "sqlite",
  host: "./config/db.sqlite",
});

//* Connects the ExpressJS app to DB
const connectToDB = () => {
  createDB
    .sync()
    .then((res) => {
      console.log("Successfully connected to database");
    })
    .catch((err) => console.log("Cannot connect to database due to:", err));
};

module.exports = { createDB, connectToDB };
