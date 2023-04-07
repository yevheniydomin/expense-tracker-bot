const { Scenes, Markup } = require('telegraf');
const db = require('./db');
const { getCategoryMarkdownButtons } = require('./buttons');


const addExpenseScene = new Scenes.BaseScene('addExpenseScene');

addExpenseScene.enter(async (ctx) => {
  const categories = await db.getAllCategoriesByTypeId(1);
  const buttons = await getCategoryMarkdownButtons();
  const buttonsIds = [];

  categories.forEach(category => buttonsIds.push(category.id));
  await ctx.deleteMessage();
  await ctx.reply('Chose a category: \n\n', Markup.inlineKeyboard(buttons));
  ctx.scene.session.categories = categories;
  ctx.scene.session.buttons = buttons;
  ctx.scene.session.buttonsIds = buttonsIds;
});

addExpenseScene.on('callback_query', async (ctx) => {
  const callbackData = ctx.update.callback_query.data;
  const buttons = ctx.scene.session.buttons;
  const clickedButton = buttons.find(button => button.callback_data === callbackData);
  ctx.reply(`${callbackData}`);
})





module.exports = addExpenseScene;