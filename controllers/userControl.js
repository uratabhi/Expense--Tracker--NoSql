const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();









const generateAccessToken = (_id, email) => {
  return jwt.sign({ userId: _id, email: email }, process.env.TOKEN);
};





const isPremiumUser = (req, res, next) => {
  if (req.user.isPremiumUser) {
    return res.json({ isPremiumUser: true });
  }
};

const getLoginPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "views", "login.html"));
  } catch (err) {
    console.log(err);
  }
};

const postUserSignUP = async (req, res, next) => {
  try {
    const name = req.body.userName;
    const email = req.body.userEmail;
    const password = req.body.userPass;
    const user = await User.findOne( { email: email } ).exec();
    if (user) {
      res
        .status(403)
        .json(
            {
              success: false,
              message: "This email is already taken. Please choose another one.",
            }
        );
    } else {
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, async (err, hash) => {
         const newUser = new User({
            name : name,
            email: email,
            password: hash,
         });
         await newUser.save();
      });
     return res
        .status(200)
        .json({
           success: true,
           message: "User Created Successfully!",
        });
    }
  } catch (error) {
    console.log(error);
  }
};

const postUserLogin = async (req, res, next) => {
  try {
    const email = req.body.loginEmail;
    const password = req.body.loginPass;

     const user = await User.findOne( { email: email } ).exec();
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: "something  went wrong" });
          }
          if (result == true) {
            return res.status(200).json({
              success: true,
              message: "Login Successful!",
              token: generateAccessToken(user._id, user.email),
            });
          } else {
            return res.status(401).json({
              success: false,
              message: "Password Incorrect!",
            });
          }
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "User doesn't Exists!",
        });
      }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Hey Abhishekk! Something went wrong",
    });
  }
};

const logout =  async (req, res, next)=>{
    try {
      res.redirect('/');
    } catch (error) {
      res.status(500).send('Error logging out');
    }
}

module.exports = {
  getLoginPage,
  postUserLogin,
  postUserSignUP,
  isPremiumUser,
  generateAccessToken,
  logout
};
