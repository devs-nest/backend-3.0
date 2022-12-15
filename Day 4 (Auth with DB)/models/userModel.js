const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); //* sequelize instance

class User extends Model {}

//* Creating the User table with name, email and password columns
User.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, modelName: "user" } //* We need to pass the sequelize instance (mandatory) and set the name of the model (optional). By default the model name is same as Class name
);

module.exports = User;
