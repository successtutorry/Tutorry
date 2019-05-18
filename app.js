var createError = require('http-errors');
var express = require('express');
var expressHbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
//var winston = require('winston');
const json = require('morgan-json');
var rfs = require('rotating-file-stream')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport  = require('passport');
const http = require('http');
const requestIp = require('request-ip');
const where = require('node-where');
const iplocation = require('iplocation');
const flash = require('connect-flash');
const session = require('express-session');
//var keystone = require('keystone');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var findtutorRouter = require('./routes/findtutor');
var MongoDBStore = require('connect-mongodb-session')(session);

require('./config/passport');



mongoose.Promise = global.Promise;

//database connection
mongoose.connect('mongodb://root:root123@ds343895.mlab.com:43895/tutorry_v1', { useNewUrlParser: true}, function(err){
  if(err){
    console.log(err);
  } else {
    console.log('Connected to the database');
  }
});

var app = express();
var store = new MongoDBStore({
  uri: 'mongodb://root:root123@ds343895.mlab.com:43895/tutorry_v1',
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});



/*var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });*/

//var logDirectory = path.join(__dirname, 'log')

// ensure log directory exists
//fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
/*var accessLogStream = rfs('information.log', {
  interval: '1h', // rotate daily
  path: logDirectory
})
const format = json(':method :url :status :res[content-length] bytes :response-time ms');*/


// view engine setup
app.engine('.hbs',expressHbs({defaultLayout:'layout',extname:'.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.use(logger('dev'));
//app.use(logger(format, { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  secret: 'tutorrysecret',
  resave: true,
  saveUninitialized: true,
  store: store
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//new middleware
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  res.locals.isAuthenticated = req.user ? true: false;
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/findtutor', findtutorRouter);

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

/*keystone.init({
  'cookie secret': 'secure string goes here',
  'mongo':'mongodb://root:root123@ds343895.mlab.com:43895/tutorry_v1',
});*/


module.exports = app;
