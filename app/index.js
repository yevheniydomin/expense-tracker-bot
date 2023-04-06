const { Sequelize, DataTypes } = require('sequelize');
const { sequelize, category } = require('./db');
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config();
const { getCategoryMarkdownButtons } = require('./buttons');


const categoryList = require('./defaultData/dbData');
const { addExpense } = require('./expenses');

const db = require('./db');

const bot = new Telegraf(process.env.TELEGRAM_API);

bot.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log('Response time: %sms', ms)
});

bot.start(async (ctx) => { ctx.reply('What we will do?', Markup.inlineKeyboard(
  [
    [Markup.button.callback('Add an expense', 'btn_1'), Markup.button.callback('Add an income', 'btn_2'), Markup.button.callback('Show the latest', 'btn_3')],
    [Markup.button.callback('Get a report', 'btn_4'), Markup.button.callback('Open the spreadsheet', 'btn_5')]
  ]
))});

bot.action('btn_1', async (ctx) => {
  const categories = await db.getAllCategoriesByTypeId(1);
  const buttons = await getCategoryMarkdownButtons();
  const buttonsIds = [];

  categories.forEach(category => buttonsIds.push(category.id));
  await ctx.deleteMessage();
  await ctx.reply('Chose a category: \n\n', Markup.inlineKeyboard(buttons));

  bot.on('callback_query', async (ctx) => {
    const callbackData = ctx.update.callback_query.data;
    const clickedButton = buttons.find(button => button.callback_data === callbackData);
    await ctx.deleteMessage();
    ctx.reply(`${callbackData}`);
  })
});

db.testDbConnection();
db.sequelize.sync().then(async () => {
  //await addExpense ('Donation', 'Udemy course', 17, '2023-03-25');
  
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

