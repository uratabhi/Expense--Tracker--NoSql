const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControl');

router.use(express.static("public"));
router.get('/login', userController.getLoginPage);
router.get('/', userController.getSignUPPage);

router.post('/signup', userController.postUserSignUP);

router.post('/login', userController.postUserLogin);


module.exports = router;