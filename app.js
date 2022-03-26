require("dotenv").config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const mongoose = require("mongoose");
var app = express();



//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(()=> console.log("Error"));

//My Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const mealRoutes = require("./routes/meal");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", mealRoutes);

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



// 1 Profile -> Update User profile option, put method to update user profile except username

// 2 Add meal -> For a specific user, when the user is signed in, add new meal

// 3 Update -> Meal we can update meal disc cal

// 4 Delete meal

// 5 IsOverlimiting

// 6 Get by date

// 7 List the meal, sort by time



