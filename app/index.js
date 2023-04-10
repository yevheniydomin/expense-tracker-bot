const { Sequelize, DataTypes } = require('sequelize');
const { sequelize, category } = require('./db');
const {
  Telegraf,
  Markup,
  Scenes: { Stage },
  session,
} = require('telegraf');
require('dotenv').config();
const db = require('./db');
const sendMainMenuButtons = require('./scenes/botStart');
const addExpenseScene = require('./scenes/addExpenseScene');
const addIncomeScene = require('./scenes/addIncomeScene');

const bot = new Telegraf(process.env.TELEGRAM_API);

addExpenseScene.enter((ctx) => ctx.reply('Expense'));
addIncomeScene.enter((ctx) => ctx.reply('Income'));
// const addIncomeScene = require('./addIncomeScene');
// const getReportScene = require('./getReportScene');
// const visitSpreadsheetScene = require('./visitSpreadsheetScene');

// Register the scenes
const stage = new Stage([
  addExpenseScene,
  addIncomeScene /*getReportScene, visitSpreadsheetScene */,
]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => sendMainMenuButtons(ctx));
bot.action('btn_1', Stage.enter('addExpenseScene'));
bot.action('btn_2', Stage.enter('addIncomeScene'));

db.testDbConnection();
db.sequelize.sync().then(async () => {
  // await addExpenseToSpreadsheet({
  //   category: 'Продукти',
  //   description: 'Test ALDI',
  //   price: 87.5,
  //   date: '2023-04-10',
  // });
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
