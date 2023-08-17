const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const app = express();


const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');
const sequelize = require('./utils/database');
const expenseRouter = require('./routes/expenseRoutes');
const purchaseMembershipRouter = require("./routes/purchaseMembershipRoutes");
const premiumRouter = require("./routes/premiumRoutes");
const resetPasswordRouter = require('./routes/resetPasswordRoutes');
const reportsRouter = require('./routes/reportsRoutes');





const Expense = require('./models/expenseModel');
const User = require('./models/userModel');
const Order = require('./models/orderModel');
const ResetPassword = require('./models/resetPasswordModel');
const filedownload = require('./models/fileDownloadModel');


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}
));
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(morgan('combined', {stream: accessLogStream}));


app.use("/", userRouter);
app.use('/user', userRouter);
app.use('/expense', expenseRouter);
app.use('/purchase', purchaseMembershipRouter);
app.use('/premium', premiumRouter);
app.use('/password', resetPasswordRouter);
app.use('/reports', reportsRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ResetPassword);
ResetPassword.belongsTo(User);

User.hasMany(filedownload);
filedownload.belongsTo(User);


sequelize
 // .sync({force : true})
 .sync()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));