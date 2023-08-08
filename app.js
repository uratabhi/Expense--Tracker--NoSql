const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", userRouter);
app.use('/user', userRouter);
app.listen(3000);