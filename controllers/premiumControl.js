const User = require('../models/userModel');
const Expense = require("../models/expenseModel");
const FileDownload = require("../models/fileDownloadModel");



const getLeaderBoard = async (req, res, next) => {
  try {
    const leaderboardOfUsers = await User.find()
      .sort({ totalExpenses: -1 }) // Sort by totalExpenses in descending order
      .select('name totalExpenses'); // Select only username and totalExpenses fields

    res.status(200).json(leaderboardOfUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};


const showFileDownloaded = async (req, res, next) => {
  try {
    const files = await FileDownload.find({ userId: req.user.id })
      .select('fileurl createdAt') // Select the fileurl and createdAt attributes
      .lean(); // Convert the Mongoose documents to plain JavaScript objects

    res.status(200).json({ data: files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};


module.exports = {getLeaderBoard, showFileDownloaded,};