const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');
const sequelize = require('./utils/database');
const expenseRouter = require('./routes/expenseRoutes');
const Expense = require('./models/expenseModel');
const User = require('./models/userModel');


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/", userRouter);
app.use('/user', userRouter);
app.use('/expense', expenseRouter);

User.hasMany(Expense);
Expense.belongsTo(User);


sequelize
  .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));