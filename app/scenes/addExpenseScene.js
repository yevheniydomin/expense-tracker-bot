const { Scenes, Markup, Composer } = require('telegraf');
const db = require('../db');
const {
  getCategoryMarkdownButtons,
  getDatesMarkdownButtons,
} = require('../common/buttons');
const moment = require('moment');
const addExpenseToSpreadsheet = require('../google/index');

const categoryStep = new Composer();
categoryStep.on('callback_query', async (ctx) => {
  try {
    ctx.scene.session.categoryId = parseInt(ctx.update.callback_query.data);
    await ctx.deleteMessage();
    await ctx.reply('Enter a description: \n');
    return ctx.wizard.next();
  } catch (err) {
    console.log(err);
    ctx.reply('Error on chosing category: \n', err);
  }
});

const descriptionStep = new Composer();
descriptionStep.on('message', async (ctx) => {
  try {
    await ctx.deleteMessage();
    ctx.scene.session.description = ctx.message.text;
    await ctx.reply(`Enter expense amount:`);
    return ctx.wizard.next();
  } catch (err) {
    ctx.reply('Error occured on Description step', err);
  }
});

const priceStep = new Composer();
priceStep.on('message', async (ctx) => {
  try {
    // get date buttons for the next step
    const buttons = await getDatesMarkdownButtons();

    // Validate price input
    const regex = /^\d+(?:\.\d{0,2})$/;
    if (regex.test(ctx.message.text)) {
      ctx.scene.session.price = Number(ctx.message.text);
      await ctx.deleteMessage();
      await ctx.reply('Chose the date:\n', Markup.inlineKeyboard(buttons));
      return ctx.wizard.next();
    }
    await ctx.deleteMessage();
    await ctx.reply('Repeat using finance format like 10.00');
  } catch (err) {
    console.log('Error occured on adding price step\n', err);
  }
});

const dateStep = new Composer();
dateStep.on('callback_query', async (ctx) => {
  try {
    await ctx.deleteMessage();
    const pickedDateId = await parseInt(ctx.update.callback_query.data);
    ctx.scene.session.date = await moment()
      .add(-9 + pickedDateId, 'days')
      .format('YYYY-MM-DD');
    const { categoryId, description, price, date } = ctx.scene.session;
    const categoryTitle = await db.getCategoryTitleById(categoryId);
    const summaryString = `Confirm adding a new expense: \n\n [${date}] <b>${categoryTitle}</b>: <i>${description}</i> - <b>${price} £</b> \n`;
    const confirmAndEditButtons = [
      [
        Markup.button.callback('✅', 'confirm'),
        Markup.button.callback('🙅‍♂️', 'cancel'),
      ],
    ];
    await ctx.replyWithHTML(
      summaryString,
      Markup.inlineKeyboard(confirmAndEditButtons)
    );

    return ctx.wizard.next();
  } catch (err) {
    ctx.reply(
      'Error has been occured on dateStep wizard scene. Please see console.'
    );
    console.error(err);
  }
});

const addExpenseToDB = new Composer();
addExpenseToDB.on('callback_query', async (ctx) => {
  try {
    if (ctx.update.callback_query.data === 'confirm') {
      const { categoryId, description, price, date } = ctx.scene.session;
      const transationTypeId = 1;
      const userId = 1; //change to chatId (add login column to user table)
      const chatId = ctx.chat.id;
      const chatIdYev = Number(process.env.CHAT_ID_YEV);
      const chatIdAlina = Number(process.env.CHAT_ID_ALINA);
    
      await db.addExpense({
        description,
        price,
        categoryId,
        date,
        transationTypeId,
        userId,
      });
      
      if(ctx.chat.id === chatIdYev || chatIdAlina ) {
        ctx.chat.id === chatIdYev ? tabTitle = process.env.GS_TAB_TITLE_YEV : tabTitle = process.env.GS_TAB_TITLE_ALINA;
        await addExpenseToSpreadsheet({
          categoryId,
          description,
          price,
          date,
          tabTitle,
        });
        await ctx.reply('Expense has been added to the spreadsheet 👍');
      }
      
      await ctx.deleteMessage();

      await ctx.reply('Expense has been added to DB 👍');
      return ctx.scene.leave();
    }
    await ctx.deleteMessage();
    await ctx.reply('Expense has been canceled 👌');
    return ctx.scene.leave();
  } catch (err) {
    ctx.reply('Error occured on the adding data to a database');
    console.log('Error on AddExpenseToDb wizard scene:\n', err);
  }
});

const addExpenseScene = new Scenes.WizardScene(
  'addExpenseScene',
  categoryStep,
  descriptionStep,
  priceStep,
  dateStep,
  addExpenseToDB
);

addExpenseScene.enter(async (ctx) => {
  const categories = await db.getAllCategoriesByTypeId(1);
  const buttons = await getCategoryMarkdownButtons();
  const buttonsIds = [];

  categories.forEach((category) => buttonsIds.push(category.id));
  await ctx.deleteMessage();
  await ctx.reply('Chose a category: \n\n', Markup.inlineKeyboard(buttons));
  ctx.scene.session.categories = categories;
  ctx.scene.session.buttons = buttons;
  ctx.scene.session.buttonsIds = buttonsIds;
});

module.exports = addExpenseScene;
