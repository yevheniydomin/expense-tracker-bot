const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define(
    'categories',
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
        unique: true,
      },
    },
    { timestamps: false }
  );

  return Category;
};
