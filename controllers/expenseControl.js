const path = require("path");
const mongoose = require("mongoose");

const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const s3service = require("../services/services");
const FileDownload = require('../models/fileDownloadModel');
require("dotenv").config();

const downloadExpenses = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const expenses = await Expense.find({ userId: req.user.id });
    console.log('expensessssssssss' + expenses);

    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const fileName = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await s3service.uploadToS3(stringifiedExpenses, fileName);

    // Create a record in MongoDB using FileDownload model
    await FileDownload.create(
      [{userId: userId, fileurl: fileUrl }], // Provide userId and fileurl
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ fileUrl, success: true });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).send({ fileUrl: '', success: false, error: err });
  }
};



const getMainPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "views", "expense.html"));
  } catch (error) {
    console.log(error);
  }
};

const addExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const expense  = new Expense({
       description: description,
       amount: amount,
       category: category,
       userId : req.user
    })
    await expense.save({ session });
    await User.updateOne(
      { _id: req.user},
      {
        $inc: { totalExpenses: Number(amount) },
      },
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(200).redirect("/expense");
  } catch (error) {
    await session.abortTransaction();
    session.endSession()
    console.log(error);
    res.status(500).send("Some error has occurred while adding expense");
  }
};

const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id } );
    res.json(expenses);
  } catch (err) {
    console.log(err);
  }
};

const getAllExpensesforPagination = async (req, res, next) => {
  try {
    const pageNo = req.params.page;
    const limit =  Number(req.params.limit);
    console.log(pageNo, limit);
    const offset = (pageNo - 1) * limit;
    const totalExpenses = await Expense.countDocuments( { userId: req.user.id });
    console.log(`totalExpenses: ${totalExpenses}`);
    const totalPages = Math.ceil(totalExpenses / limit);
    console.log(`totalPages is ${totalPages}`);
    const expenses = await Expense.find({ userId: req.user.id })
    .skip(offset)
    .limit(limit);
    res.json({ expenses: expenses, totalPages: totalPages });
  } catch (err) {
    console.log(err);
  }
};

const deleteExpense = async (req, res, next) => {
  const id = req.params.id;
  try {
    console.log(id, req.user.id);
    const expense = await Expense.findOne({_id : id, userId : req.user})
    const user = await User.findById(req.user.id);
    user.totalExpenses -= expense.amount;
    await user.save();
    await Expense.deleteOne({_id : id , userId : req.user});
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
  const expense = await Expense.findOne({_id : id, userId : req.user});
  const user = await User.findById(req.user.id);
  user.totalExpenses = user.totalExpenses - expense.amount + Number(amount);
    
  await user.save();

  await Expense.updateOne(
     { _id : id, userId : req.user.id},
     {
       category : category, 
       description : description,
       amount : amount,
     }
  )
  res.redirect("/expense");
};
module.exports = {
  getMainPage,
  addExpense,
  getAllExpenses,
  deleteExpense,
  editExpense,
  downloadExpenses,
  getAllExpensesforPagination
};
