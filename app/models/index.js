const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('postgres://yev:qwerty2023@localhost:5432/dev');
const Category = require('./category')(sequelize);
const Transaction = require('./transaction')(sequelize);
Transaction.hasOne(Category);
Category.hasMany(Transaction);

module.exports = {
  sequelize: sequelize,
  category: Category,
  transaction: Transaction
}