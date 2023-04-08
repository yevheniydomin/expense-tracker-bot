// const { Sequelize, DataTypes } = require('sequelize');
// const { sequelize } = require('./db');
const db = require('../db');
const { Markup } = require('telegraf');
const moment = require('moment');


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
      buttons[countLine].push(Markup.button.callback(categories[i].title, categories[i].id));
      if(buttons[countLine].length === 3) {
        countLine++
      }
    }
    return buttons
  } catch (err) {
    console.error(err);
  }
}

const getDatesMarkdownButtons = async function () {
  try {
    const buttons = [[],[],[]];
    const currentDate = await moment();

  // fill last two weeks dates in two arrays for Markup buttons
  for(let i = 1; i < 4; i++) {
    await buttons[0].push(Markup.button.callback(moment().add(i - 9, 'days').format('DD-MMMM'), i));
    await buttons[1].push(Markup.button.callback(moment().add(i - 6, 'days').format('DD-MMMM'), i + 3));
    await buttons[2].push(Markup.button.callback(moment().add(i - 3, 'days').format('DD-MMMM'), i + 6));
    console.log(buttons, ' BUTTONS');
  }
  return buttons;
  } catch (err) {
    console.error('Error on creating buttons for dates\n', err);
  }
  
}

module.exports = {
  getCategoryMarkdownButtons,
  getDatesMarkdownButtons
}
