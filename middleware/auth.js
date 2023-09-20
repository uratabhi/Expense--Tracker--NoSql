const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require('dotenv').config();


const authenticate = async (req, res, next)=>{
      try {
        const token = req.header ("Authorization");
        if(!token){
          return res.status(401).json({success : false});
        }
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const user = await User.findById(decodedToken.userId);

        if(!user){
          return res.status(401).json({success : false});
        }
        req.user = user;
        next();
      } catch (error) {
         console.log(error);
         return res.status(401).json({success : false});
      }
};

module.exports = authenticate;


/*const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify(
      token,
      "somesecretkey"
    );
    User.findByPk(user.userId).then((user) => {
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};

module.exports = authenticate;
*/