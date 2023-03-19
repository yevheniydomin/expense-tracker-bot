const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize('postgres://yev:qwerty2023@localhost:5432/dev');
const db = require('./models');
const Category = db.category;
const Transaction = db.transaction;



const testDbConnection = async function () {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testDbConnection();

db.sequelize.sync({ force: true }).then(() => {
  Category.create({
    title: "Products",
    type: 'Expense'
  })
    .then(res => {
      console.log('Row has been created');
    }).catch(err => {
      console.log(err);
    })
});


