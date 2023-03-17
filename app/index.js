const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://yev:qwerty2023@localhost:5432/dev');

const testDbConnection = async function () {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testDbConnection();
