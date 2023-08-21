const path = require('path');


const getReportsPage = (req, res, next)=>{
     res.sendFile(path.join(__dirname, "../", "views", "reports.html"));
}
const getLeaderboardPage = async(req, res, next) => {
     try {
       res.sendFile(
         path.join(__dirname, "../",  "views", "leaderboard.html")
       );
     } catch {
       (err) => console.log(err);
     }
   }

module.exports = {getReportsPage, getLeaderboardPage};