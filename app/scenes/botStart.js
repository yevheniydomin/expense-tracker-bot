const { Markup } = require('telegraf');

const sendMainMenuButtons = async function (ctx) {
  const context = ctx;
  context.reply(
    'What we will do?',
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
};

module.exports = sendMainMenuButtons;
