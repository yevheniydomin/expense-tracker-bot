const { Sequelize, DataTypes } = require('sequelize');
const categoryList = require('./db_init_data/dbData');

//const sequelize = new Sequelize('postgres://yev:qwerty2023@localhost:5432/dev');
const sequelize = new Sequelize(
  process.env.POSTGRES_DATABASE,
  process.env.POSTGRES_USERNAME,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: process.env.POSTGRES_DIALECT,
  }
);
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
  transactionTypesList.forEach((type) => {
    try {
      TransactionType.findOrCreate({
        where: { title: type },
        defaults: { title: type },
      });
    } catch (error) {
      console.log('Error on adding transaction types to DB ', error);
    }
  });
};

categoryTableInit = async function (categoryList) {
  categoryList.forEach((category) => {
    try {
      Category.findOrCreate({
        where: {
          title: category[0],
          transactionTypeId: category[1],
        },
        defaults: {
          title: category[0],
          transactionTypeId: category[1],
        },
      });
    } catch (error) {
      console.log('Error on adding transaction types to DB ', error);
    }
  });
};

const anotherTitle = async function (chatId) {
  try {
    await User.findOrCreate({
      where: {
        chatId,
      },
      defaults: {
        chatId,
      },
    });
  } catch (error) {
    console.log('Error on adding transaction types to DB ', error);
  }
};

dbInit = async function () {
  await transactionTypeTableInit(['Expense', 'Income', 'Move', 'Borow']);
  await categoryTableInit(categoryList);
  //await addNewUser(181703780);
};

addTransaction = async function (options) {
  try {
    await Transaction.create(options);
  } catch (error) {
    console.log('Error on adding transaction to DB ', error);
  }
};

//type = integer
getAllCategoriesByTypeId = async function (type) {
  try {
    const categories = await Category.findAll({
      where: {
        transactionTypeId: type,
      },
    });
    return categories.map((category) => {
      return category;
    });
  } catch (err) {
    console.error('Error getting all expense categories from DB', err);
  }
};

getCategoryTitleById = async function (id) {
  try {
    const category = await Category.findOne({ where: { id } });
    return category.title;
  } catch (err) {
    console.log('Error on getting category title by id \n', err);
  }
};

addExpense = async function (args) {
  const { userId, categoryId, description, price, date } = args;
  if (!(await Category.findOne({ categoryId: categoryId }))) {
    console.log('Message to user, that category doesnt exist');
    return;
  }

  if (!Number.isInteger(price)) {
    console.log('Price should be a number');
  }

  try {
    Transaction.create({
      description,
      price,
      date,
      categoryId,
      transactionTypeId: 1,
      userId,
    });
  } catch (err) {
    console.log('Error has been occured on adding expense', err);
  }
};

getUserIdByChatId = async function (chatId) {
  try {
    const user = await User.findOne(
    {
      where: {
        chatId
      }
    });
    return user.id;
  } catch (err) {
    console.error('Error on getting userId from db');
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
  addTransaction: addTransaction,
  dbInit: dbInit,
  getAllCategoriesByTypeId: getAllCategoriesByTypeId,
  addExpense: addExpense,
  getCategoryTitleById,
  getUserIdByChatId,
  addNewUser: anotherTitle,
};
