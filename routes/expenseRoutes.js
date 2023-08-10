const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseControl');


router.get('/', expenseController.getMainPage);
router.get("/getAllExpenses", expenseController.getAllExpenses);
router.get("/deleteExpense/:id", expenseController.deleteExpense);
router.post("/editExpense/:id", expenseController.editExpense);
router.post("/addExpense", expenseController.addExpense);


module.exports = router;