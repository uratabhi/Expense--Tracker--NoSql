const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPasswordControl');


router.get('/forgotPasswordPage', resetPasswordController.getforgotPasswordPage);

router.get('/resetPasswordPage/:uuid', resetPasswordController.resetPasswordPage);

router.post('/sendMail', resetPasswordController.sendMail);

router.post('/resetPassword', resetPasswordController.updatePassword);

module.exports = router;
