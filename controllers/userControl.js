const path = require('path');
const User = require('../models/userModel');
const Sequelize = require('sequelize');

exports.getLoginPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views", "index.html"));
};

exports.signupData = (req, res, next)=>{
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