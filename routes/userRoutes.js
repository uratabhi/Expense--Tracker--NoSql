const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControl');
const userAuthentication = require('../middleware/auth');

router.get('/', userController.getLoginPage);

router.get('/isPremiumUser', userAuthentication, userController.isPremiumUser);

router.get('/logout', userAuthentication, userController.logout);



router.post('/signUp', userController.postUserSignUP);

router.post('/login', userController.postUserLogin);


module.exports = router;