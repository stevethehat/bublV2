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
		
	resize: function(inFileName, outFileName, maxWidth, maxHeight, callback){
		var self = this;
		
		self.ensureDirectoryExists(inFileName);
		self.ensureDirectoryExists(outFileName);
		
		self.info(inFileName,
			function(info){
				var originalWidth = info.width;
				var originalHeight = info.height;
				var fitToWidth = maxWidth;
				var fitToHeight = maxHeight;

				var _originalWidth = originalWidth;
				var _originalHeight = originalHeight;

				var scale = 0, scaleWidth, scaleHeight, flooredHeight, flooredWidth;

				if ((maxWidth != 0) && (maxHeight != 0)) {
					scaleWidth = originalWidth / maxWidth;
					scaleHeight = originalHeight / maxHeight;

					if (scaleWidth >= scaleHeight) {
						scale = scaleWidth;
						maxHeight = 0;
					} else {
						scale = scaleHeight;
						maxWidth = 0;
					}
				} else {
					if (maxHeight != 0) {
						scale = originalHeight / maxHeight;
					}
					if (maxWidth != 0) {
						scale = originalWidth / maxWidth;
					}
				}

				if (maxHeight == 0) {
					if (scale != 0) {
						flooredHeight = Math.floor(originalHeight / scale);
						maxHeight = flooredHeight;
					} else {
						maxHeight = originalHeight;
					}
				}

				if (maxWidth == 0) {
					if (scale != 0) {
						flooredWidth = Math.floor(originalWidth / scale);
						maxWidth = flooredWidth;
					} else {
						maxWidth = originalWidth;
					}
				}

				var vBorder = 0;
				var hBorder = 0;

				vBorder = Math.floor((fitToHeight - maxHeight) / 2);
				hBorder = Math.floor((fitToWidth - maxWidth) / 2);

				console.log('');
				console.log('RESIZE');
				console.log('width = ' + info.width + ' height = ' + info.height);
				console.log('max width = ' + maxWidth + ' max height ' + maxHeight);
				console.log('scale width = ' + scaleWidth + ' scale height = ' + scaleHeight);
				
				var convertArguments = 'convert  -resize ' + maxWidth;
				if (maxHeight != 0) {
					convertArguments += 'x' + maxHeight;
				}
				convertArguments += ' -bordercolor "' + info.majorColor + '" -border ' + hBorder + 'x' + vBorder;
		
				convertArguments += ' "' + inFileName + '" ';
				convertArguments += ' "' + outFileName + '"';
				
				console.log('LETS DO THE RESIZE ');
				console.log(convertArguments);
				
				self.execCommand(convertArguments,
					function(){
						callback(info);
					}	
				)
				callback(
					{
						'width': maxWidth,
						'height': maxHeight,
						'scale': scale,
						'majorColor': info.majorColor,
						'contrastColor': info.contrastColor
					}
				)			
			}
		);
	},	
	
	generateThumbnail: function(sizes, callback){
		var self = this;
		
		if(sizes.length > 0){
			var thumbnailInfo = sizes[0];
			sizes.shift();
			console.log('generate thumbnail "' + thumbnailInfo.width + ' x ' + thumbnailInfo.height + '"');
			
			self.resize(thumbnailInfo.inFilePath, thumbnailInfo.outFilePath, thumbnailInfo.width, thumbnailInfo.height,
				function(resizeInfo){
					thumbnailInfo['majorColor'] = resizeInfo['majorColor'];
					thumbnailInfo['contrastColor'] = resizeInfo['contrastColor'];
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
	
	getMajorColor: function(output){
		var self = this;
		var colors = output.split('\n');
		var currentMaxRating = 0;
		
		console.log('getMajorColor from '+ colors.length + ' colors');
		var majorColor = null;
		
		
		for(var i=0; i< colors.length; i++){
			var color = colors[i];
			console.log(color);
			var rating = Number(color.substr(0, color.indexOf(':')).trim());
			if(rating > currentMaxRating){
				majorColor = color;
				currentMaxRating = rating;
			}
			//console.log('color rating = "' + count + '"');	
		}	
		
		console.log('major color = "' + majorColor + '"');	
		
		var hexValue = majorColor.substr(majorColor.indexOf('#'), 7);
		console.log('hex value = "' + hexValue + '"');
		
		return(hexValue);
	},
	
	getContrastColor: function(hexcolor){
		if(hexcolor.substr(0,1) === '#'){
			hexcolor = hexcolor.substr(1);
		}
		var r = parseInt(hexcolor.substr(0,2),16);
		var g = parseInt(hexcolor.substr(2,2),16);
		var b = parseInt(hexcolor.substr(4,2),16);
		var yiq = ((r*299)+(g*587)+(b*114))/1000;
		
		var result = (yiq >= 128) ? 'black' : 'white';
		console.log('get contrast color for ' + hexcolor + ' = ' + result); 
		return(result);
	},

	
	info: function(fileName, callback){
		var self = this;
		
		//convert stirling.png -colors 16 -depth 8 -format "%c" histogram:info:
		
		self.execCommand('convert ' + fileName + ' -colors 16 -depth 8 -format "%c" histogram:info:',
			function(out, err){
				console.log('image colors ');
				console.log(out);
				
				var majorColorHexValue = self.getMajorColor(out);
				
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
							'height': height,
							'majorColor': majorColorHexValue,
							'contrastColor': self.getContrastColor(majorColorHexValue) 
						};
						callback(info);	
				});				
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

