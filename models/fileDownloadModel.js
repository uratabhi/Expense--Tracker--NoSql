const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const fileSchema = new Schema({
     fileurl : {
        type : String, 
        required : true,
     },
     userId : {
         type : Schema.Types.ObjectId,
         ref : "User", 
         required : true,
     }
});

const file = mongoose.model('File', fileSchema);

module.exports = file;



/*const Sequelize=require('sequelize');
const sequelize=require('../utils/database');


const file =sequelize.define('filedownloaded',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    fileurl:{
        type:Sequelize.STRING,
        allowNull:false
    }

});
module.exports=file;
*/