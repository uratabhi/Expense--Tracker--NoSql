const express = require('express');
const userAuthentication = require('../middleware/auth');
const premiumController = require('../controllers/premiumControl');
const router = express.Router();

router.get('/showLeaderBoard', userAuthentication, premiumController.getLeaderBoard);

module.exports = router;