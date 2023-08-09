const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControl');

router.get('/', userController.getLoginPage);

router.post('/signUp', userController.postUserSignUP);

router.post('/login', userController.postUserLogin);


module.exports = router;