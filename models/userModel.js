const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const userSchema = new Schema({
     name : {
       type : String, 
       required : true
     },
     email : {
        type: String,
        required : true,
        unique : true
     },
     password:{
       type: String,
       required : true
     },
     isPremiumUser : {
       type : Boolean,
       default : false,
     },
     totalExpenses : {
       type : Number,
       default : 0,
     },
});

const User = mongoose.model('User', userSchema);
module.exports = User;


// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');

// const User = sequelize.define('users', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//       },
//     Name : Sequelize.STRING,
//     Email : {
//        type:Sequelize.STRING,
//        unique: true,
//     },
//     Password : Sequelize.STRING,
//     isPremiumUser: Sequelize.BOOLEAN,
//     totalExpenses : {
//       type : Sequelize.INTEGER,
//       defaultValue : 0,
//     }
// });

// module.exports = User;