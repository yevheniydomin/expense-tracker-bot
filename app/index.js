const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./db');
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config();
const { getCategoryMarkdownButtons } = require('./buttons');


const categoryList = require('./defaultData/dbData');
const { addExpense } = require('./expenses');

const db = require('./db');

const bot = new Telegraf(process.env.TELEGRAM_API);
bot.start(async (ctx) => { ctx.reply('What can I help?', Markup.inlineKeyboard(
  [
    [Markup.button.callback('Add an expense', 'btn_1'), Markup.button.callback('Add an income', 'btn_2'), Markup.button.callback('Show the latest', 'btn_3')],
    [Markup.button.callback('Get a report', 'btn_4'), Markup.button.callback('Open the spreadsheet', 'btn_5')]
  ]
))});

bot.action('btn_1', async (ctx) => {
  const buttons  = await getCategoryMarkdownButtons();
  ctx.reply('Ctegories: ', Markup.inlineKeyboard(buttons));
});

db.testDbConnection();
db.sequelize.sync().then(async () => {
  //await addExpense ('Donation', 'Udemy course', 17, '2023-03-25');
  
});
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

