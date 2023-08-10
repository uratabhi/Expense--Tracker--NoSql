const path = require("path");

const Expense = require("../models/expenseModel");

const getMainPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "views", "expense.html"));
  } catch (error) {
    console.log(error);
  }
};

const addExpense = async (req, res, next) => {
  try {
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const result = await Expense.create({
      description: description,
      amount: amount,
      category: category,
    });
    res.redirect("/expense");
  } catch (error) {
    console.log(error);
  }
};

const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (err) {
    console.log(err);
  }
};

const deleteExpense = async (req, res, next) => {
  const id = req.params.id;
  try {
    const expense = await Expense.findByPk(id);
    await expense.destroy();
    console.log("expense Deleted");
    res.redirect("/expense");
  } catch (error) {
    console.log(error);
  }
};

const editExpense = (req, res, next) => {
  const id = req.params.id;
  const category = req.body.category;
  const description = req.body.description;
  const amount = req.body.amount;
  Expense.findByPk(id)
    .then((expense) => {
      expense.category = category;
      expense.description = description;
      expense.amount = amount;
      return expense.save();
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getMainPage,
  addExpense,
  getAllExpenses,
  deleteExpense,
  editExpense,
};
