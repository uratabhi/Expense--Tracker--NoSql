const mongoose = require('mongoose') 


const Schema = mongoose.Schema;


const OrderSchema  = new Schema({
    paymentId : {
       type : String, 
    },
    orderId : {
      type : String, 
      requried : true,
    },
    status : {
      type : String, 
      required : true,
    },
    userId : {
       type : Schema.Types.ObjectId, 
       ref : "User",
       required : true,
    }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;

/*const Sequelize = require("sequelize");
const sequelize = require("../utils/database");


const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  paymentid: Sequelize.STRING,
  orderid: Sequelize.STRING,
  status: Sequelize.STRING,
});

module.exports = Order;
*/