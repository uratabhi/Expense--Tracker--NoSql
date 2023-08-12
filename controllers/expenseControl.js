const path = require("path");

const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

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
      userId: req.user.id,
    });
    await User.update({
      totalExpenses: Number(req.user.totalExpenses) + Number(amount),

    },{where :{id : req.user.id}})
    res.redirect("/expense");
  } catch (error) {
    console.log(error);
  }
};

const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    res.json(expenses);
  } catch (err) {
    console.log(err);
  }
};

const deleteExpense = async (req, res, next) => {
  const id = req.params.id;
  try {
    console.log(id, req.user.id);
    const expense = await Expense.findOne({
      where: { id: id, userId: req.user.id },
    });
    await expense.destroy();
    console.log("expense Deleted");
    res.redirect("/expense");
  } catch (error) {
    console.log(error);
  }
};

const editExpense = async (req, res, next) => {
  const id = req.params.id;
  const category = req.body.category;
  const description = req.body.description;
  const amount = req.body.amount;
  console.log(id, category, description, amount);
  await Expense.update(
    {  
      category,
      description,
      amount,
    },
    {
      where: {
        id : id,
        userId: req.user.id,
      },
    }
  );
  res.redirect("/expense");
};

module.exports = {
  getMainPage,
  addExpense,
  getAllExpenses,
  deleteExpense,
  editExpense,
};
