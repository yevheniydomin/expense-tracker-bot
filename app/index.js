const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./db');
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config();

const categoryList = require('./defaultData/dbData');
const { addExpense } = require('./expenses');

const db = require('./db');
const Category = db.category;
const Transaction = db.transaction;
const TransactionType = db.transactionType;
const User = db.user;

const bot = new Telegraf(process.env.TELEGRAM_API);
bot.start(async (ctx) => { ctx.reply('What can I help?', Markup.inlineKeyboard(
  [
    [Markup.button.callback('Add an expense', 'btn_1'), Markup.button.callback('Add an income', 'btn_2'), Markup.button.callback('Show the latest', 'btn_3')],
    [Markup.button.callback('Get a report', 'btn_4'), Markup.button.callback('Open the spreadsheet', 'btn_5')]
  ]
))});

bot.action('btn_1', async (ctx) => {
  try {
    const categories = await db.getAllCategoriesByTypeId(1);
    const buttonsLinesCount = parseInt(categories.length / 3); 
    let buttons = [];

    // 3 buttons in one line
    for (let i = 0; i < buttonsLinesCount; i++) { 
      buttons.push([]);
    }

    let countLine = 0;
    for(let i = 0; i < categories.length; i++) {
      buttons[countLine].push(Markup.button.callback(categories[i], categories[i]));
      if(buttons[countLine].length === 3) {
        countLine++
      }
    }
    
    ctx.reply('Ctegories: ', Markup.inlineKeyboard(buttons));
  } catch (err) {
    ctx.reply('Ups... Error has occured', err);
    console.error(err);
  }
});

db.testDbConnection();
db.sequelize.sync().then(async () => {
  //await addExpense ('Donation', 'Udemy course', 17, '2023-03-25');
  
});
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

