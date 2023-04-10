const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define(
    'transactions',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
    },
    { timestamps: false }
  );

  return Transaction;
};
