const path = require('path');

exports.getLoginPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views", "index.html"));
};
