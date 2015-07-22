
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var fs = require('fs');

router.post('/', 
	function(request, response, next){
		var object = request.body;
		
		console.log('dump');
		console.log(object);
	
		fs.writeFile("../logs/lastpage.log", JSON.stringify(object, null, 4), 
			function(err) {
		    	if(err) {
		        	return console.log(err);
		    	}
		    	console.log("The file was saved!");
				fs.writeFile("../bubl/www/lastpage.json", JSON.stringify(object, null, 4), 
					function(err) {
				    	if(err) {
				        	return console.log(err);
				    	}
				    	console.log("The file was saved!");
						response.send('ok');
					}
				);
			}
		);
	}
); 	

module.exports = router;
