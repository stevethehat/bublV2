var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var request = require('request');




var MediaServices = {	
	capture: function(url, outFileName, width, height, delay, callback){
		var self = this;
		
		self.ensureDirectoryExists(outFileName);
		self.execCommand('cutycapt --url="' + url + '" --delay=' + delay + ' --out="' + outFileName + '"',
			function(){
				callback();
			}
		);
	},
	resize: function(inFileName, outFileName, requiredWidth, requiredHeight, callback){
		var self = this;
		
		self.ensureDirectoryExists(inFileName);
		self.ensureDirectoryExists(outFileName);
		
		self.info(inFileName,
			function(info){
				var scale;
				var scaleWidth = info.width / requiredWidth;
				var scaleHeight = info.height / requiredHeight;
				var width, height;
		
				if (scaleWidth >= scaleHeight) {
					scale = scaleWidth;
					width = Math.floor(info.width / scale);
					height = requiredHeight;
				} else {
					scale = scaleHeight;
					width = requiredWidth;
					height = Math.floor(info.height / scale);
				}
				
				self.execCommand('convert -resize ' + width + 'x' + height + ' ' + inFileName + ' ' + outFileName,
					function(){
						callback();
					}	
				)
				
				callback(
					{
						'width': width,
						'height': height,
						'scale': scale
					}
				)			
			}
		);

		/*
		self.execCommand('convert -resize ' + width + 'x' + height + ' ' + inFileName + ' ' + outFileName,
			function(){
				callback();
			}	
		)
		*/
	},	
	
	generateThumbnail: function(sizes, callback){
		var self = this;
		
		if(sizes.length > 0){
			var thumbnailInfo = sizes[0];
			sizes.shift();
			console.log('generate thumbnail "' + thumbnailInfo.width + ' x ' + thumbnailInfo.height + '"');
			
			self.resize(thumbnailInfo.inFilePath, thumbnailInfo.outFilePath, thumbnailInfo.width, thumbnailInfo.height,
				function(){
					self.generateThumbnail(sizes, callback);			
				} 
			);
		} else {
			callback();		
		}
	},
	
	generateThumbnails: function(sizes, filePath, callback){
		var self = this;
		
		var thumbnailSizes = [];
		for(var i=0; i<sizes.length; i++){
			var size = sizes[i];			
			var dimensions = size.split('x');
			var width = dimensions[0];
			var height = dimensions[1];
			var fileName = path.basename(filePath);
			var outFilePath = path.resolve('../bubl/www/app/img/assets/' + width + 'x' + height + '/' + fileName);
			thumbnailSizes.push(
				{
					'width': width,
					'height': height,
					'inFilePath': filePath,
					'outFilePath': outFilePath,
					'url': 'img/assets/' + width + 'x' + height + '/' + fileName
				}
			);		
		}
		console.log('generate thumbnails ' + filePath + ' ' + JSON.stringify(thumbnailSizes, null, 4));
		var response = thumbnailSizes.slice();
		
		self.generateThumbnail(thumbnailSizes, 
			function(){
				callback(response);		
			}	
		);		
	},
	
	info: function(fileName, callback){
		var self = this;
			
		self.execCommand('identify ' + fileName,
			function(out, err){
				var outBits = out.split(' ');
				var dimensions = outBits[2].split('x');
				var width = dimensions[0];
				var height = dimensions[1];
				var info = { 
					'type': outBits[1],
					'dimensions': dimensions,
					'width': width,
					'height': height  
				};
				callback(info);	
		});
	},
	ensureDirectoryExists: function(fileName){
		var directory = path.dirname(fileName);
		
	  	try {
    		fs.mkdirSync(directory);
  		} catch(e) {
    		if ( e.code != 'EEXIST' ) throw e;
  		}	
	},
	
	download: function(url, fileName, callback){
		var self = this;
		self.ensureDirectoryExists(fileName);

		
		request.head(url, function(err, res, body){
			console.log('content-type:', res.headers['content-type']);
			console.log('content-length:', res.headers['content-length']);
		
			request(url).pipe(fs.createWriteStream(fileName)).on('close', callback);
		});
	},	
	
	generateTempFileName: function(uri){
		var fileName = uri.substr(uri.lastIndexOf('/'));
		if(fileName.indexOf('?') != -1){
			fileName = fileName.substring(0, fileName.indexOf('?'));
		}
		console.log('generate temp filename from ' + fileName);
		
		return(path.resolve('../bubl/www/app/img/assets/temp/' + fileName));	
	},
	
	execCommand: function(command, callback){
		// executes `pwd`
		console.log('==========================================');
		console.log('EXEC "' + command + '"');
		console.log('==========================================');
		var child = exec(command, function (error, stdout, stderr) {
		  console.log('stdout: ' + stdout);
		  console.log('stderr: ' + stderr);
		  if (error !== null) {
		    console.log('exec error: ' + error);
		  }
		  callback(stdout, stderr);
		});	
	}	
}

module.exports = MediaServices;

