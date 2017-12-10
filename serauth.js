
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var myEmitter = require('./methods/emiters');

mongoose.Promise = require('bluebird');

var db = mongoose.connect('mongodb://localhost:27017/Auth', {
  useMongoClient: true,
  /* other options */
});

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

app.set('view engine', 'ejs');

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from template
app.use(express.static(__dirname + '/public'));

// include routes
var routes = require('./routes/do');
app.use('/', routes);
var dynamic = require('./routes/dynamic');
app.use('/', dynamic);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port 3000
var server = app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});

var io = require('socket.io')(server);
io.on('connection', function(socket) {  
    console.log("Connnected");
    myEmitter.on('changed',function(processes){
        socket.emit('changed',processes);
    });
    socket.on('diconnection', function(){
        console.log('Disconnected');
    })
});