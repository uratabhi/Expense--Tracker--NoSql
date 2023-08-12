const User = require('../models/userModel');
const sequelize = require('../utils/database');
const Expense = require("../models/expenseModel");

const getLeaderBoard = async (rea, res, next) =>{
     try {
        const users =  await User.findAll();
        const expenses = await  Expense.findAll();

        const aggregatedExpenses = {};
        expenses.forEach((expense)=>{
             if(aggregatedExpenses[expense.userId]){
                aggregatedExpenses[expense.userId] = aggregatedExpenses[expense.userId]+expense.amount;
             }
             else{
                aggregatedExpenses[expense.userId] = expense.amount;
             }
        })
        const userLeaderboardDetails = [];
        users.forEach((user)=>{
            userLeaderboardDetails.push({name : user.Name,  total_cost : aggregatedExpenses[user.id]  || 0});
        });
        console.log(userLeaderboardDetails);
        userLeaderboardDetails.sort((a, b)=> b.total_cost-a.total_cost);
        res.status(200).json(userLeaderboardDetails);
        
     } catch (err) {
         console.log(err);
         res.status(500).json(err);
     }
}

module.exports = {getLeaderBoard};