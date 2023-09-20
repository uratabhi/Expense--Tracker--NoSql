const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ResetPasswordSchema = new Schema({
      isActive : {
         type : Boolean,
         required : true,
         default : true,
      },
      userId : {
         type : Schema.Types.ObjectId,
         required : true,
      }
});

const ResetPassword = mongoose.model('ResetPassword', ResetPasswordSchema);
module.exports = ResetPassword;






/*const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const ResetPassword = sequelize.define('ResetPassword', {
    id :{
        type : Sequelize.STRING,
        primaryKey : true,
        allowNull : false,
    },
    isActive: Sequelize.BOOLEAN,
    
})

module.exports = ResetPassword; 

*/