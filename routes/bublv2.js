var express = require('express');
var router = express.Router();
var _ = require('underscore');
var objectStore = require('../lib/objectstore');
var url = require('url');
var http = require('http');
var httpProxy = require('http-proxy');

function requestStart(){
	/*
	console.log('');
	console.log('');
	console.log('===================================================================================================');
	console.log('');
	console.log('');
	*/
}

router.all('/*'),
	function(request, response, next){
		console.log('YAY !!!!!   !!!!!  !!!!! using proxy');
		var proxy = httpProxy.createServer();
		//proxy.on
		proxy.web(request, response, { 'target': 'http://bubblestore.blob.core.windows.net' });	
	}

/*
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
	var azureHost = request.session.host;
	var azurePath = request.session.path;
	
	console.log('host="' + azureHost + '" path ="' + azurePath + '"');
	
	var options = {
  		host: azureHost,
  		path: azurePath,
		method: 'PUT'
	};
	console.log('we have the body');
	var azureRequest = http.request(options,
		function(result){
			console.log('we have a response');
			//console.log(result);
			response.write(result.statusCode.toString());
			//next();					
		}
	);
	azureRequest.write(request.rawBody);
	azureRequest.end();
	console.log('request sent');
});
*/



module.exports = router;
