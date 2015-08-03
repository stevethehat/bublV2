
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var media = require('../lib/media');
var path = require('path');


router.post('/capture',
	function(request, response, next){ 
		var self = this;
		var object = request.body;
		var url = object.url;
		var fileName = object.fileName;

		console.log(JSON.stringify(object));
		
		var filePath = path.resolve('../bubl/www/app/img/' + fileName);
		var thumbnailFilePath = path.resolve('../bubl/www/app/img/100x100/' + fileName);
		
		object['filePath'] = filePath;
		object['thumbnailFilePath'] = thumbnailFilePath;
		
		media.capture(url, filePath, 100, 100, 
			function(){
				media.resize(filePath, thumbnailFilePath, 100, 100,
					function(){
						response.send({'result': 'ok', 'request': object });
						console.log('done');			
					}
				)
			}
		);
	}
); 	

router.all('/resize', 
	function(request, response, next){
		var object = request.body;
		console.log(JSON.stringify(object));
		response.send({'result': 'ok', 'request': object });
	}
); 	


module.exports = router;
