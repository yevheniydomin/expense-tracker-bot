const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./db');
const db = require('./db');
const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');

const getCategoryMarkdownButtons = async function () {
  try {
    //getting categories from db
    const categories = await db.getAllCategoriesByTypeId(1);
    let buttonsLinesCount = await parseInt(categories.length / 3);
    if (categories.length % 3) buttonsLinesCount++;
    let buttons = [];
  
    // 3 buttons in one line
    for (let i = 0; i < buttonsLinesCount; i++) { 
      buttons.push([]);
    }
  
    let countLine = 0;
    for(let i = 0; i < categories.length; i++) {
      buttons[countLine].push(Markup.button.callback(`${categories[i].id} - ${categories[i].title}`, `ctg-${categories[i].id}`));
      if(buttons[countLine].length === 3) {
        countLine++
      }
    }
    console.log(buttons);
    return buttons
    //await ctx.reply('Ctegories: ', Markup.inlineKeyboard(buttons));
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getCategoryMarkdownButtons,
}
