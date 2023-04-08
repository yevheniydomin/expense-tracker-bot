const { Scenes, Markup, Composer } = require('telegraf');
const db = require('../db');
const { getCategoryMarkdownButtons } = require('../buttons');


const categoryStep = new Composer();
categoryStep.on('callback_query', async (ctx) => {
  try {
    const callbackData = ctx.update.callback_query.data;
    const buttonsIds = ctx.scene.session.buttonsIds;
    const buttons = ctx.scene.session.buttons;
    const clickedButton = buttons.find(button => button.callback_data === callbackData);
    ctx.scene.session.category = parseInt(callbackData);
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
    ctx.reply(`Description: ${ctx.message.text}`);
  } catch (err) {
    ctx.reply('Error occured on Description step', err);
  }
});

const addExpenseScene = new Scenes.WizardScene('addExpenseScene', categoryStep, descriptionStep);
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