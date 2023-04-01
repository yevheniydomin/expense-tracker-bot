const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./db');
const categoryList = require('./defaultData/dbData');

const db = require('./db');
const Category = db.category;
const Transaction = db.transaction;
const TransactionType = db.transactionType;
const User = db.user;

const addExpense = async function (category, comment, price, date = null) {
  if (! await Category.findOne({ title: category })) {
    console.log('Message to user, that category doesnt exist');
    return;
  }

  if (!Number.isInteger(price)) {
    console.log('Write message to user that price should be a number');
  }

  await Category.findOne({
    where: {
      title: category
    },
    raw: true
  }).then((category) => {
    try {
      Transaction.create({
        description: comment,
        price: price,
        date: '2023-03-05',
        categoryId: category.id,
        transactionTypeId: 1,
        userId: 1
      });
    } catch (err) {
      console.log('Write message to user that error has been occured on adding expense', err);
    }
  });
}

module.exports = {
  addExpense,
}