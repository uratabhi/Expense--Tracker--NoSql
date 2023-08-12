const User = require('../models/userModel');
const sequelize = require('../utils/database');
const Expense = require("../models/expenseModel");

const getLeaderBoard = async (rea, res, next) =>{
     try {
        const leaderboarsofusers = await  User.findAll({
         order: [['totalExpenses', "DESC"]],
        });
        //console.log(leaderboarsofusers);
        
        res.status(200).json(leaderboarsofusers);
        
     } catch (err) {
         console.log(err);
         res.status(500).json(err);
     }
}

module.exports = {getLeaderBoard};