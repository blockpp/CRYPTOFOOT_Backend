var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv');
var cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const mongoose = require("mongoose");
var connectDB = require('./db');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const bodyParser = require('body-parser');
const traderRouter = require('./routes/Trader');
const adminRouter = require('./routes/Admin');
const corporateRouter = require('./routes/Corporate');
const marketplaceRouter = require('./routes/Marketplace');
const {authenticateTrader,authenticateAdmin,authenticateCorporate} = require('./middleware/Authenticate');

var app = express();
// view engine setup

connectDB();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors()) // Use this after the variable declaration

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// app.use(Keycloak.middleware());

app.use('/', indexRouter);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/users', usersRouter);
app.use('/trader',traderRouter);
app.use('/corporate' , corporateRouter);
app.use('/admin', adminRouter);
app.use('/marketplace', marketplaceRouter);

// app.use('/trader',authenticateTrader ,authenticateAdmin,traderRouter);
// app.use('/admin',authenticateAdmin, adminRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
