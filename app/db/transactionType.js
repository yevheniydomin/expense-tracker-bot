const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TransactionType = sequelize.define(
    'transaction_types',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
    },
    { timestamps: false }
  );

  return TransactionType;
};
