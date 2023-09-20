const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;


/*const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Expense = sequelize.define('expenses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
    amount : Sequelize.INTEGER,
    description : Sequelize.STRING,
    category : Sequelize.STRING,
});

module.exports = Expense;
*/
