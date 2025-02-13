var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var indexRouter = require("./router.js");
var cookieParser = require('cookie-parser');

var app = express();
var url = "https://portal-ccbs.mobimart.xyz/api/token/get";
const nocache = require("nocache");
const cors = require("cors");
require("reflect-metadata");
const { ConnectNgrok, getAuthToken } = require("./ngrok");
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", indexRouter);

getAuthToken(url);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (req, res, next) 
{
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

app.use(nocache());
// error handler
app.use(function (err, req, res, next) 
{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
//router
module.exports = app