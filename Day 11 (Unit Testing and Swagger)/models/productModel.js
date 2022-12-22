const { DataTypes } = require("sequelize");
const { createDB } = require("../config/db");

const Product = createDB.define("product", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: DataTypes.STRING,
  price: DataTypes.DECIMAL,
  content: DataTypes.STRING,
});

module.exports = Product;
