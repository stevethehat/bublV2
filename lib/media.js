var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');



var MediaServices = {	
	capture: function(url, outFileName, width, height, callback){
		var self = this;
		
		self.ensureDirectoryExists(outFileName);
		self.execCommand('cutycapt --url="' + url + '" --out="' + outFileName + '"',
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
	
	execCommand: function(command, callback){
		// executes `pwd`
		console.log('exec "' + command + '"');
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

