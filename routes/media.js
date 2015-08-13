
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var media = require('../lib/media');
var path = require('path');

// dummy images here.. http://dummyimage.com/
// e.g. http://dummyimage.com/340x200/fff/aaa.png&text=New+asset


router.post('/capture',
	function(request, response, next){ 
		var self = this;
		var object = request.body;
		var url = object.url;
		var fileName = object.fileName;
		var width = object.width;
		var height = object.height;

		console.log(JSON.stringify(object));
		
		var filePath = path.resolve('../bubl/www/app/img/assets/' + fileName);
		var thumbnailFilePath = path.resolve('../bubl/www/app/img/assets/' + width + 'x' + height + '/' + fileName);
		
		object['filePath'] = filePath;
		object['thumbnailFilePath'] = thumbnailFilePath;
		
		media.capture(url, filePath, width, height, 
			function(){
				media.resize(filePath, thumbnailFilePath, width, height,
					function(info){
						response.send({'result': 'ok', 'request': object, 'info': info });
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
		var fileName = object.fileName;
		var filePath = path.resolve('../bubl/www/app/img/assets/' + fileName);

		media.resize(filePath, '', object.width, object.height,
			function (info){
				response.send({'result': 'ok', 'request': object, 'info': info });		
			}
		);		
	}
); 	

router.all('/info',
	function(request, response, next){
		var object = request.body;
		var fileName = object.fileName;
		var filePath = path.resolve('../bubl/www/app/img/assets/' + fileName);
		
		media.info(filePath,
			function(info){
				response.send({'result': 'ok', 'info': info });		
			}
		);		
	}
);

module.exports = router;
