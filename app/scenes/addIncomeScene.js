const { Scenes } = require('telegraf');

const addIncomeScene = new Scenes.BaseScene('addIncomeScene');

addIncomeScene.enter((ctx) => {
  ctx.reply('Income');
  ctx.scene.leave();
});

module.exports = addIncomeScene;
