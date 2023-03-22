const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./models');
const categoryList = require('./initData/dbData');

const db = require('./models');
const Category = db.category;
const Transaction = db.transaction;
const TransactionType = db.transactionType;
const User = db.user;

db.testDbConnection();
db.sequelize.sync().then(() => {
  db.dbInit().then(() => {
    db.addTransaction({
      price: 77.87,
      description: 'Aldi',
      date: 1679392695,
      categoryId: 1,
      userId: 1,
      transactionTypeId: 1
    });
  });
});


