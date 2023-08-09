const path = require('path');
const User = require('../models/userModel');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');


const getLoginPage = async (req, res, next)=>{
     try {
      res.sendFile(path.join(__dirname, "../", "views", "login.html"));
     } catch (err) {
        console.log(err);
     }
}

const postUserSignUP = async (req, res, next)=>{
     try{
      const Name = req.body.userName;
      const Email = req.body.userEmail;
      const Password = req.body.userPass;
      const user =  await User.findOne({where : {Email : Email}})
      if(user){
        res.status(403).send(
          `<script>alert('This email is already taken. Please choose another one.'); window.location.href='/'</script>`
        );
      }
      else{
        const saltRounds = 10;
        bcrypt.hash(Password, saltRounds, async(err, hash)=>{
         await User.create({
            Name,
            Email, 
            Password : hash,
         });
        })
        res
        .status(200)
        .send(
          `<script>alert('User Created Successfully!'); window.location.href='/'</script>`
        );
      }
     }
     catch(error){
        console.log(error);
     }
}

const postUserLogin = async (req, res, next) => {
  try {
    const Email = req.body.loginEmail;
    const Password = req.body.loginPass;

     const user =  User.findOne({ where: { Email: Email } }).then((user) => {
      if (user) {
        bcrypt.compare(Password, user.Password, (err, result) => {
          if (err) {
            return res
            .status(500)
            .json({ success: false, message: 'something  went wrong' });
          }
          if (result == true) {
            return res.status(200).json({
              success: true,
              message: "Login Successful!",
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
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {getLoginPage, postUserLogin, postUserSignUP};