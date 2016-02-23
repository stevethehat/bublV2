
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var fs = require('fs');

function dumpFile(fileName, object){
	fs.unlink(fileName,
		function(){
			fs.writeFile(fileName, JSON.stringify(object, null, 4), 
				function(err) {
			    	if(err) {
			        	return console.log(err);
			    	}
				}
			);
		}
	);
}

function dumpText(fileName, text){
	fs.unlink(fileName,
		function(){
			fs.writeFile(fileName, text, 
				function(err) {
			    	if(err) {
			        	return console.log(err);
			    	}
				}
			);
		}
	);
}

router.post('/', 
	function(request, response, next){
		var object = request.body;
		dumpFile('../bubl/www/lastpage.json', object);		
		response.send('ok');
	}
); 	

router.post('/:dump_file/astext', 
	function(request, response, next){
		var text = request.body;
		dumpText('../bubl/www/dumps/' + request.params.dump_file, text);		
		response.send('ok');
	}
); 	


router.post('/:dump_file', 
	function(request, response, next){
		var object = request.body;
		dumpFile('../bubl/www/dumps/' + request.params.dump_file + '.json', object);		
		response.send('ok');
	}
); 	


module.exports = router;
