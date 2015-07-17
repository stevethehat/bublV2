var express = require('express');
var router = express.Router();
var _ = require('underscore');
var objectStore = require('../lib/objectstore');
var url = require('url');
var http = require('http');

function requestStart(){
	console.log('');
	console.log('');
	console.log('===================================================================================================');
	console.log('');
	console.log('');
}

router.get('/init', function(request, response, next){
	requestStart();

	request.session.uploadUrl = request.query['uploadUrl'];

	var parsedUrl = url.parse(request.session.uploadUrl);
	request.session.host = parsedUrl.host;
	request.session.path = parsedUrl.path; 
	
	console.log('init upload');
	console.log(request.session.uploadUrl);
	 
	response.send({ 'result': 'OK' });
});

router.get('/test', function(request, response, next){
	console.log('init test');
	console.log(request.session.uploadUrl);
	 
	response.send(
		{ 
			'result': 'OK', 
			'uploadUrl': request.session.uploadUrl,
			'host': request.session.host,
			'path': request.session.path 
		}
	);
});

router.all('/block', function(request, response, next){
	requestStart('post block');
	
	var options = {
  		host: request.session.host,
  		path: request.session.path
	};
	var object = request.body;
	
	response.send('well we got this far');
	http.request(options,
		function(result){
			next();					
		}
	);
});

module.exports = router;
