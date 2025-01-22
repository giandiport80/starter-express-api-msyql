require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('public/uploads'));
app.use(cookieParser());
require('./config/logger');

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

app.use('/api', routes);

module.exports = app;
