// server.js
// Janahan Mathanamohan
// ``

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var passport = require('passport');
var bodyParser = require("body-parser");
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoOp = require("./app/models/database.js");

require('./config/passport')(passport);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.set('view engine', 'ejs');
console.log(__dirname);
app.use(express.static(__dirname + '/views/public'));
// required for passport
app.use(session({
    secret: 'testing', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());


require('./app/routes.js')(app,passport);
app.listen(8081);
