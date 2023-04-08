const { Scenes, Markup, Composer } = require('telegraf');
const db = require('../db');
const { getCategoryMarkdownButtons, getDatesMarkdownButtons } = require('../common/buttons');


const categoryStep = new Composer();
categoryStep.on('callback_query', async (ctx) => {
  try {
    ctx.scene.session.category = parseInt(ctx.update.callback_query.data);
    await ctx.deleteMessage();
    await ctx.reply('Add Expense description: \n');
    return ctx.wizard.next();
    
  } catch (err) {
    console.log(err);
    ctx.reply('Error on chosing category: \n', err);
  }
 
});

const descriptionStep = new Composer();
descriptionStep.on('message', async (ctx) => {
  try {
    ctx.scene.session.description = ctx.message.text;
    ctx.reply(`Description: ${ctx.message.text} ${ctx.scene.session.category}. Please write the price:`);
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

    // Validate sum input
    const regex = /^\d+(?:\.\d{0,2})$/;
    if(regex.test(ctx.message.text)) {
      ctx.scene.session.price = Number(ctx.message.text);
      await ctx.deleteMessage();
      await ctx.reply('Chose the date:\n', Markup.inlineKeyboard(buttons));
      return ctx.wizard.next();
    }  
  } catch (err) {
    console.log('Error occured on adding price step\n', err);
  }
});

const dateStep = new Composer();
dateStep.on('callback_query', async (ctx) => {
  try {
    
    const pickedDateId = await parseInt(ctx.update.callback_query.data);
    ctx.reply(`dateID - ${pickedDateId}`);
  } catch(err) {
    ctx.reply('Error has been occured on dateStep wizard scene. Please see console.');
    console.error(err);
  }
});

const addExpenseScene = new Scenes.WizardScene('addExpenseScene', categoryStep, descriptionStep, priceStep, dateStep);
addExpenseScene.enter(async (ctx) => {
  const categories = await db.getAllCategoriesByTypeId(1);
  const buttons = await getCategoryMarkdownButtons();
  const buttonsIds = [];
  //ctx.wizard.state.data = {};
  

  categories.forEach(category => buttonsIds.push(category.id));
  await ctx.deleteMessage();
  await ctx.reply('Chose a category: \n\n', Markup.inlineKeyboard(buttons));
  ctx.scene.session.categories = categories;
  ctx.scene.session.buttons = buttons;
  ctx.scene.session.buttonsIds = buttonsIds;
});

module.exports = addExpenseScene;