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
	resize: function(inFileName, outFileName, width, height, callback){
		var self = this;
		
		self.ensureDirectoryExists(inFileName);
		self.ensureDirectoryExists(outFileName);

		self.execCommand('convert -resize ' + width + 'x' + height + ' ' + inFileName + ' ' + outFileName,
			function(){
				callback();
			}	
		)
		
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
		  callback();
		});	
	}	
}

module.exports = MediaServices;

