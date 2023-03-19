const {Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define ('category', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true
    },
    type: {
      type: Sequelize.ENUM('Expense', 'Income', 'Savings', 'Inner move'),
      allowNull: false
    }
  },
  { timestamps: false }
  );

  return Category;
}