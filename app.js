process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer  = require('multer');

var routes = require('./routes/index');
var users = require('./routes/users');
var animals = require('./functions/reportFinding');
var badges = require('./routes/badges');

var Badge = require('./models/badges');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

var done=false;
var router = express.Router();

app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));



app.use('/', routes);
app.use('/animals',animals);
app.use('/badges',badges);
//var Soap = require('./soaps/analys');

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://hack:hackhack@ds039341.mongolab.com:39341/heroku_app34877600');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// mongoose.connection.collections['badges'].drop( function(err) {
//   console.log('collection dropped');
// });
// var badge1 = new Badge({ 
//     text: 'Letare!',
//     criteria:{prop:'sightings',theVal:1},
//     imageUrl: '/badges/letare.png'
// });
// badge1.save(function(err, badge1){
//     if (err) return console.error(err);
// });
// var badge2 = new Badge({ 
//     text: 'Femling',
//     criteria:{prop:'sightings',theVal:5},
//     imageUrl: '/badges/femling.png'
// });
// badge2.save(function(err, badge2){
//     if (err) return console.error(err);
// });

//var dyntaxa = require('./api/dyntaxa');

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
