var express = require('express');
var router = express.Router();
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//var session = require('express-session');
var bodyParser = require('body-parser');
var _s = require('underscore.string');

var objects = require('./routes/objects');
var upload = require('./routes/upload');
var bublv2 = require('./routes/bublv2');
var dump = require('./routes/dump');
var media = require('./routes/media');


var app = express();

app.set('port', process.env.PORT || 3000);
console.log('Running on PORT ' + app.get('port'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
//app.use(session({secret: '1234567890QWERTY'}));
app.use(express.static('www'));

app.all('/*', function(req, res, next) {
	console.log('===================================================================================================');
	console.log('===================================================================================================');
    console.log('CLIENT IP ' + req.ip);
	
	console.log('adding cors headers');
  	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

	console.log('path="' + req.path + '"');
	if(_s.startsWith(req.path, '/api/')){
		console.log('running json middleware');

		bodyParser.json()(req, res, next); 
		console.log(req.body);
		bodyParser.urlencoded({ extended: false });		
	} else {
		/*
	  	req.rawBody = '';
  		req.setEncoding('utf8');

  		req.on('data', function(chunk) { 
    		req.rawBody += chunk;
  		});

  		req.on('end', function() {
			console.log('processed requset rawBody ' + req.rawBody.length)
    		next();
  		});
		*/
		bodyParser.urlencoded({ extended: false });		
		next();	
	}
});

app.use('/api/objects', objects);
app.use('/api/dump', dump);
app.use('/api/media', media);
app.use('/bublv2', bublv2);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  	var err = new Error('Not Found');
  	err.status = 404;
  	next(err);
});

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
