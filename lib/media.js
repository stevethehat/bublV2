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
	
	/*
			int originalWidth = originalImage.Width;
			int originalHeight = originalImage.Height;
			int fitToWidth = maxWidth;
			int fitToHeight = maxHeight;

			_originalWidth = originalWidth;
			_originalHeight = originalHeight;

			double scale = 0, scaleWidth, scaleHeight, flooredHeight, flooredWidth;


			try {
				if ((maxWidth != 0) && (maxHeight != 0)) {
					scaleWidth = Convert.ToDouble(originalWidth) / Convert.ToDouble(maxWidth);
					scaleHeight = Convert.ToDouble(originalHeight) / Convert.ToDouble(maxHeight);

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
						flooredHeight = Math.Floor(originalHeight / scale);
						maxHeight = Convert.ToInt32(flooredHeight);
					} else {
						maxHeight = originalHeight;
					}
				}

				if (maxWidth == 0) {
					if (scale != 0) {
						flooredWidth = Math.Floor(originalWidth / scale);
						maxWidth = Convert.ToInt32(flooredWidth);
					} else {
						maxWidth = originalWidth;
					}
				}

				int vBorder = 0;
				int hBorder = 0;

				if (borderColor != "") {
					// calculate borders..
					vBorder = Convert.ToInt32(Math.Floor((Double)(fitToHeight - maxHeight) / 2));
					hBorder = Convert.ToInt32(Math.Floor((Double)(fitToWidth - maxWidth) / 2));
				}

				if ((OriginalHeight != maxHeight) && (OriginalWidth != maxWidth)) {
					SaveScaledVersion(scaledFileName, maxWidth, maxHeight, vBorder, hBorder, borderColor);
				} else {
					System.IO.File.Copy(_fileName, scaledFileName, true);
				}
	*/
	
	
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

				/*
				if ((_originalHeight != maxHeight) && (_originalWidth != maxWidth)) {
					SaveScaledVersion(scaledFileName, maxWidth, maxHeight, vBorder, hBorder, borderColor);
				} else {
					System.IO.File.Copy(_fileName, scaledFileName, true);
				}
				*/
								
				console.log('');
				console.log('RESIZE');
				console.log('width = ' + info.width + ' height = ' + info.height);
				console.log('max width = ' + maxWidth + ' max height ' + maxHeight);
				console.log('scale width = ' + scaleWidth + ' scale height = ' + scaleHeight);
				
				var convertArguments = 'convert  -resize ' + maxWidth;
				if (maxHeight != 0) {
					convertArguments += 'x' + maxHeight;
				}
				convertArguments += ' -bordercolor White -border ' + hBorder + 'x' + vBorder;
		
				convertArguments += ' "' + inFileName + '" ';
				convertArguments += ' "' + outFileName + '"';
				
				console.log('LETS DO THE RESIZE ');
				console.log(convertArguments);
				
				self.execCommand(convertArguments,
					function(){
						callback();
					}	
				)
				/*
				self.execCommand('convert -resize ' + width + 'x' + height + ' ' + inFileName + ' ' + outFileName,
					function(){
						callback();
					}	
				)
				*/
				callback(
					{
						'width': maxWidth,
						'height': maxHeight,
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

