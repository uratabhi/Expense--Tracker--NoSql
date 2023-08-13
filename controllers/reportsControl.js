const path = require('path');


const getReportsPage = (req, res, next)=>{
     res.sendFile(path.join(__dirname, "../", "views", "reports.html"));
}

module.exports = {getReportsPage};