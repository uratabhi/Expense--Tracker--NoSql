const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseControl');
const userAuthentication = require('../middleware/auth');


 router.get('/', expenseController.getMainPage);
 router.get("/getAllExpenses",   userAuthentication, expenseController.getAllExpenses);
 router.get("/deleteExpense/:id", userAuthentication,expenseController.deleteExpense);
 router.get('/getAllExpenses/:page/:limit', userAuthentication, expenseController.getAllExpensesforPagination);
 router.post("/editExpense/:id", userAuthentication,expenseController.editExpense);
 router.get('/download', userAuthentication, expenseController.downloadExpenses);
 router.post("/addExpense", userAuthentication,expenseController.addExpense);


module.exports = router;