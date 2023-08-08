const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControl');

router.use(express.static("public"));

router.get('/', userController.getLoginPage);

router.post('/signup', userController.signupData);


module.exports = router;