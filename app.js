const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');
const sequelize = require('./utils/database');
const expenseRouter = require('./routes/expenseRoutes');
const purchaseMembershipRouter = require("./routes/purchaseMembershipRoutes");
const premiumRouter = require("./routes/premiumRoutes");
const resetPasswordRouter = require('./routes/resetPasswordRoutes');





const Expense = require('./models/expenseModel');
const User = require('./models/userModel');
const Order = require('./models/orderModel');
const ResetPassword = require('./models/resetPasswordModel');


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use("/", userRouter);
app.use('/user', userRouter);
app.use('/expense', expenseRouter);
app.use('/purchase', purchaseMembershipRouter);
app.use('/premium', premiumRouter);
app.use('/password', resetPasswordRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ResetPassword);
ResetPassword.belongsTo(User);


sequelize
  //.sync({force : true})
 .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));