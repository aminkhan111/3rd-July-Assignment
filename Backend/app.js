const express = require('express');
const app = express();
const authRouter = require('./router/authRouter');
const databaseconnect = require('./config/databaseConfig');
const cookieParser = require('cookie-parser');

databaseconnect();

app.use(express.json());

app.use(cookieParser());


app.use('/api/auth', authRouter);

app.use('/', (req, res) => {res.status(200).json({data: 'JWT Auth server'});
});
  
module.exports = app;