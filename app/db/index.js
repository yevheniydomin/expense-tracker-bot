const { Sequelize, DataTypes } = require('sequelize');
const categoryList = require('../defaultData/dbData');

const sequelize = new Sequelize('postgres://yev:qwerty2023@localhost:5432/dev');
const Category = require('./category')(sequelize);
const Transaction = require('./transaction')(sequelize);
const TransactionType = require('./transactionType')(sequelize);
const User = require('./user')(sequelize);

Transaction.belongsTo(Category);
Transaction.belongsTo(User);
Transaction.belongsTo(TransactionType);
Category.belongsTo(TransactionType);

const testDbConnection = async function () {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

transactionTypeTableInit = async function (transactionTypesList) {
  transactionTypesList.forEach(type => {
    try {
        TransactionType.findOrCreate({
        where: { title: type },
        defaults: { title: type }
      });
    } catch (error) {
    console.log ('Error on adding transaction types to DB ', error);
  }
  });
};

categoryTableInit = async function (categoryList) {
  categoryList.forEach(category => {
    try {
        Category.findOrCreate({
        where: { 
          title: category[0],
          transactionTypeId: category[1]
        },
        defaults: { 
          title: category[0],
          transactionTypeId: category[1] 
        }
      });
    } catch (error) {
    console.log ('Error on adding transaction types to DB ', error);
  }
  });
};

addUser = async function (userList) {
  userList.forEach(user => {
    try {
        User.findOrCreate({
        where: { 
          title: user,
        },
        defaults: { 
          title: user, 
        }
      });
    } catch (error) {
    console.log ('Error on adding transaction types to DB ', error);
  }
  });
};

dbInit = async function () {
  await transactionTypeTableInit(['Expense', 'Income', 'Move', 'Borow']);
  await categoryTableInit(categoryList);
  await addUser(['Yevhen', 'Alina']);
}

addTransaction = async function (options) {
  try {
   await Transaction.create(options)
  } catch (error) {
    console.log('Error on adding transaction to DB ', error);
  }
}

//type = integer
getAllCategoriesByTypeId = async function (type) {
  try {
    const categories = await Category.findAll({
      where: {
        transactionTypeId: type
      }
    });
    return categories.map((category) => {
      return category;
    });

  } catch (err) {
    console.error('Error getting all expense categories from DB', err);
  }
}

module.exports = {
  sequelize: sequelize,
  category: Category,
  transaction: Transaction,
  transactionType: TransactionType,
  user: User,
  testDbConnection: testDbConnection,
  transactionTypeTableInit: transactionTypeTableInit,
  categoryTableInit: categoryTableInit,
  addUser: addUser,
  addTransaction: addTransaction,
  dbInit: dbInit,
  getAllCategoriesByTypeId: getAllCategoriesByTypeId,
}





