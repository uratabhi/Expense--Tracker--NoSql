const path = require('path');
const User = require('../models/userModel');
const Sequelize = require('sequelize');


exports.getLoginPage = (req, res, next)=>{
    res.sendFile(path.join(__dirname, "../", "views", "login.html"));
}

exports.postUserSignUP = (req, res, next)=>{
     const Name = req.body.userName;
     const Email = req.body.userEmail;
     const Password = req.body.userPass;
     User.create({
        Name : Name,
        Email:Email,
        Password:Password,
     })
     .then((result)=>{
        console.log("User credentials is added to the database");
        res.redirect('/');
     })
     .catch((error)=>{
        if (error instanceof Sequelize.UniqueConstraintError) {
            // Handle the unique constraint error
            res.status(403).send(
                `<script>alert('This email is already taken. Please choose another one.'); window.location.href='/'</script>`
              );
          } else {
            // Handle other errors
            console.error('An error occurred:', error);
          }
     })
}

exports.postUserLogin = (req, res, next) => {
    const Email = req.body.loginEmail;
    const Password = req.body.loginPass;
  
    User.findOne({ where: { Email: Email } }).then((user) => {
      if (user) {
        if (user.Password == Password) {
          res
            .status(200)
            .send(
              `<script>alert('Login Successful!'); window.location.href='/'</script>`
            );
        } else {
          res
            .status(401)
            .send(
              `<script>alert('Password Incorrect!'); window.location.href='/'</script>`
            );
        }
      } else {
        res
          .status(404)
          .send(
            `<script>alert("User doesn't Exists!"); window.location.href='/'</script>`
          );
      }
    });
  };