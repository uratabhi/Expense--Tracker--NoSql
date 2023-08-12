const User = require('../models/userModel');
const sequelize = require('../utils/database');
const Expense = require("../models/expenseModel");

const getLeaderBoard = async (rea, res, next) =>{
     try {
        const leaderboarsofusers = await  User.findAll({
         attributes : ['id', 'name', [sequelize.fn("sum", sequelize.col("expenses.amount")), "total_cost"]],
         group : ['userId'],
         include : [{
             model : Expense,
             attributes : []
         }],
         group :['id'],
         order: [[sequelize.fn("sum", sequelize.col("amount")), "DESC"]],
        });
        //console.log(leaderboarsofusers);
        
        res.status(200).json(leaderboarsofusers);
        
     } catch (err) {
         console.log(err);
         res.status(500).json(err);
     }
}

module.exports = {getLeaderBoard};