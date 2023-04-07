const { Sequelize, DataTypes } = require('sequelize');
const { sequelize, category } = require('./db');
const { Telegraf, Markup, Scenes: { Stage }, Scenes, session } = require('telegraf');
require('dotenv').config();
const { getCategoryMarkdownButtons } = require('./buttons');


const categoryList = require('./defaultData/dbData');
const { addExpense } = require('./expenses');
const db = require('./db');

const bot = new Telegraf(process.env.TELEGRAM_API);

const addExpenseScene = require('./addExpenseScene');
const addIncomeScene = require('./addIncomeScene');

addExpenseScene.enter((ctx) => ctx.reply('Expense'));
addIncomeScene.enter((ctx) => ctx.reply('Income'));


// const addIncomeScene = require('./addIncomeScene');
// const getReportScene = require('./getReportScene');
// const visitSpreadsheetScene = require('./visitSpreadsheetScene');

// Register the scenes
const stage = new Stage([addExpenseScene, addIncomeScene /*getReportScene, visitSpreadsheetScene */]);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => { ctx.reply('What we will do?', Markup.inlineKeyboard(
  [
    [
      Markup.button.callback('Add an expense', 'btn_1'), 
      Markup.button.callback('Add an income', 'btn_2'),
      Markup.button.callback('Show the latest', 'btn_3')
    ],
    [
      Markup.button.callback('Get a report', 'btn_4'), 
      Markup.button.callback('Open the spreadsheet', 'btn_5')
    ]
  ]
))});


bot.action('btn_1', Stage.enter('addExpenseScene'));
bot.action('btn_2', Stage.enter('addIncomeScene'));


// bot.action('btn_1', async (ctx) => {
//   const categories = await db.getAllCategoriesByTypeId(1);
//   const buttons = await getCategoryMarkdownButtons();
//   const buttonsIds = [];

//   categories.forEach(category => buttonsIds.push(category.id));
//   await ctx.deleteMessage();
//   await ctx.reply('Chose a category: \n\n', Markup.inlineKeyboard(buttons));

//   bot.on('callback_query', async (ctx) => {
//     const callbackData = ctx.update.callback_query.data;
//     const clickedButton = buttons.find(button => button.callback_data === callbackData);
//     await ctx.deleteMessage();
//     ctx.reply(`${callbackData}`);
//   })
// });

db.testDbConnection();
db.sequelize.sync().then(async () => {
  //await addExpense ('Donation', 'Udemy course', 17, '2023-03-25');
  
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

