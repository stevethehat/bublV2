
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var media = require('../lib/media');
var path = require('path');

// dummy images here.. http://dummyimage.com/
// e.g. http://dummyimage.com/340x200/fff/aaa.png&text=New+asset

router.get('/test',
    function(request, response, next){
        response.send({'result': 'ok', 'info': 'test complete' });        
    }
);

router.post('/capture',
	function(request, response, next){ 
		var self = this;
		var object = request.body;
		var url = object.url;
		var fileName = object.fileName;
		var width = object.width;
		var height = object.height;
		var delay = object.delay;
		
		if(delay === undefined){
			delay = 0;
		}

		console.log(JSON.stringify(object));
		
		var filePath = path.resolve('./www/app/img/assets/' + fileName);
		var thumbnailFilePath = path.resolve('./www/app/img/assets/' + width + 'x' + height + '/' + fileName);
		
		object['filePath'] = filePath;
		object['thumbnailFilePath'] = thumbnailFilePath;
        
        console.log('delay = ' + delay);
        console.time('capture');
		
		media.capture(url, filePath, width, height, delay,
			function(){
                console.log('TIME (after capture)= ');
                console.timeEnd('capture');
                console.time('resize');
				media.resize(filePath, thumbnailFilePath, width, height,
					function(info){
                        console.log('TIME (after resize)= ');
                        console.timeEnd('resize');
                        
						response.send({'result': 'ok', 'request': object, 'info': info });
						//response.write(JSON.stringify({'result': 'ok', 'request': object, 'info': info }, null, 4));
						//response.send('{}');
						//next();
						console.log('done');	
					}
				)
			}
		);
	}
); 	



router.all('/thumbnails', 
	function(request, response, next){
		var object = request.body;
		var fileName = object.uri;
		var sizes = object.sizes;
		var result = '';
		
		console.log('thumbnailing "' + fileName + '"');
		if(fileName.lastIndexOf('http') === 0){
			// download first
			var filePath = media.generateTempFileName(fileName);
			media.download(fileName, filePath,
				function(){
					media.generateThumbnails(sizes, filePath,
						function(thumbnailInfo){
							console.log('thumbnail response ' + JSON.stringify(thumbnailInfo, null, 4));
							response.send({'result': 'ok', 'request': object, 'response': thumbnailInfo });						
						}
					);
				}
			)
		} else {
			var filePath = path.resolve('./www/app/img/assets/' + fileName);
			media.generateThumbnails(sizes, filePath,
				function(thumbnailInfo){
					response.send({'result': 'ok', 'request': object, 'response': thumbnailInfo });											
				}
			)			
		}				
	}
); 	

router.all('/resize', 
	function(request, response, next){
		var object = request.body;
		var fileName = object.fileName;
		var filePath = path.resolve('./www/app/img/assets/' + fileName);

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
		var filePath = path.resolve('./www/app/img/assets/' + fileName);
		
		media.info(filePath,
			function(info){
				response.send({'result': 'ok', 'info': info });		
			}
		);		
	}
);

module.exports = router;
