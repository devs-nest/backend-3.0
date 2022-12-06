const { Sequelize } = require("sequelize");

//* Instantiates sequelize with the name of database, username, password and configuration options
const createDB = new Sequelize("test-db", "user", "pass", {
  dialect: "sqlite",
  host: "./config/db.sqlite",
});

module.exports = createDB;
