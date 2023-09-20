const Razorpay = require("razorpay");
const Order = require("../models/orderModel");
const userController = require("./userControl");
const User = require('../models/userModel');
require('dotenv').config();

exports.purchasePremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.Razorpay_key_ID,
      key_secret: process.env.Razorpay_key_SECRET,
    });
    const amount = 49900;
    console.log("Entered in Controller");
    rzp.orders.create({ amount, currency: "INR" }, async(err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      const userId = req.user.id;
      const newOrder = new Order({
        userId : userId,
        orderId : order.id,
        status : 'PENDING',
      });
      await newOrder.save();
      return res.status(201).json({order, key_id : rzp.key_id});

    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something  went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne( { orderId: order_id } );
    const promise1 = order.updateOne({
      paymentId: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = User.updateOne({_id : userId}, { isPremiumUser: true });

    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({
          sucess: true,
          message: "Transaction Successful",
          token: userController.generateAccessToken(userId, undefined, true),
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Sometghing went wrong" });
  }
};