const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsControl");


router.get('/getReportsPage', reportsController.getReportsPage);
router.get('/getLeaderboardPage',  reportsController.getLeaderboardPage);




module.exports = router;
