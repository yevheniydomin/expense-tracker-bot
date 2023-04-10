const { Markup } = require('telegraf');
const { addNewUser } = require('../db');

const sendMainMenuButtons = async function (ctx) {
  try {
    const context = ctx;
    const chatId = await ctx.chat.id;
    await addNewUser(chatId);
    context.reply(
      'Chose an option:\n',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('Add an expense', 'btn_1'),
          Markup.button.callback('Add an income', 'btn_2'),
          Markup.button.callback('Show the latest', 'btn_3'),
        ],
        [
          Markup.button.callback('Get a report', 'btn_4'),
          Markup.button.callback('Open the spreadsheet', 'btn_5'),
        ],
      ])
    );
  } catch (err) {
    console.error('Error on /start:\n', err);
  }
};

module.exports = sendMainMenuButtons;
