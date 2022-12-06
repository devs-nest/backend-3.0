const { Sequelize } = require('sequelize');
//creating a database in sqlite
const createDB = new Sequelize("test-db","user","pass",{
  dialect:"sqlite",
  host:"./config/db.sqlite",
});

module.exports = createDB;