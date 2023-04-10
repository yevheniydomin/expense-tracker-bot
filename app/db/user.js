const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      }
    },
    { timestamps: false }
  );

  return User;
};
