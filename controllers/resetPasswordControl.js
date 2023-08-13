const path = require("path");
const Sib = require("sib-api-v3-sdk");
const User = require("../models/userModel");
const ResetPassword = require("../models/resetPasswordModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../utils/database");
require("dotenv").config();
let userIdtoUpdate = 0;

const getforgotPasswordPage = (req, res, next) => {
  try {
    res
      .status(200)
      .sendFile(path.join(__dirname, "../", "views", "forgotPassword.html"));
  } catch (error) {
    console.log(error);
  }
};

const sendMail = async (req, res, next) => {
  try {
    const email = req.body.email;
    const uuid = uuidv4();
    const defaultClient = Sib.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY;
    const transEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "waitabhi2015@gmail.com",
      name: "uratAbhi",
    };
    const receivers = [
      {
        email: req.body.email,
      },
    ];
    const emailResponse = await transEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Forgot Password",
      htmlContent: `<h3>Hi! We got the request from you for reset the password. Here is the link below >>></h3>
                    <a href="http://localhost:3000/password/resetPasswordPage/{{params.link}}"> Click Here</a>`,
      params: {
        link: uuid,
      },
    });
    const t = await sequelize.transaction();
    const userData = await User.findOne({
      where: { Email: email },
      attributes: ["id"],
      transaction: t,
    });
    console.log(userData);
    await ResetPassword.create({
      id: uuid,
      isActive: true,
      userId: userData.dataValues.id,
    });
    await t.commit();
    return res.status(200).json({
      message:
        "Link for reset the password is successfully sent on your mail Id.",
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error has occurred" });
  }
};

const resetPasswordPage = async (req, res, next) => {
  try {
    const uuid = req.params.uuid;
    console.log(uuid);
    const response = await ResetPassword.findByPk(uuid, {
      attributes: ["isActive", "userId"],
    });
    if (response.dataValues.isActive == true) {
      userIdtoUpdate = response.dataValues.userId;
      res
        .status(200)
        .sendFile(path.join(__dirname, "../", "views", "resetPassword.html"));
    }
  } catch (error) {
    console.log(error);
  }
};

const updatePassword = async (req, res, next) => {
  const Password = req.body.password;
  console.log(Password);
  try {
    const t = await sequelize.transaction();
    bcrypt.hash(Password, 10, async function (err, hash) {
      try {
        if (err) {
          console.log("error in this block");
          throw new Error(err);
        } else {
          await User.update(
            { Password: hash },
            { where: { id: userIdtoUpdate }, transaction: t }
          );
          await ResetPassword.update(
            { isActive: false },
            { where: { userId: userIdtoUpdate }, transaction: t }
          );
          await t.commit();
          res
            .status(201)
            .json({ message: "Successfuly update the new password" });
        }
      } catch (error) {
        return res
          .status(404)
          .json({ message: "No user Exists", success: false });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error, success: false });
  }
 
};

module.exports = {
  sendMail,
  getforgotPasswordPage,
  resetPasswordPage,
  updatePassword,
};
