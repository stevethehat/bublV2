"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {
	
	function Uploader (params, parent) {
		if (arguments.length > 0) {
			ZEN.ui.Control.call(this, params, parent);
		}
		return this;
	}

	Uploader.prototype = new ZEN.ui.Control();

	_.extend(Uploader.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Control.prototype.init.call(this, params, parent);
				//ZEN.events.GridHandler (this, this.el);
			},

			label: function () {
			},

			notify: function (message) {
				message.source = this;

				ZEN.log(message.type);
				
				if (message.type === 'highlight') {
					this.el.addClass('hover');
				} else {
					this.el.removeClass('hover');
				}

				if(message.type === 'active') {
					ZEN.notify ("ui.Grid", message);
				}
			},

			getElement: function () {
				var self = this;
				if (this.el === null) {
					ZEN.ui.Base.prototype.getElement.call(this);
					// this.el.attr('tabindex',0);
					this.el.addClass('zen-Uploader');
					self.setupUploader();
					this.resize();
				}
				return this.el;
			}, 

			setupUploader: function(){
				var self = this;
				self.fileIndex = 0;
				self.asset = bublApp.variables['properties'];				

				var id = this.el.attr('id') + 'uploaded';	
				var dropArea = $('<div class="uploader" id="' + id + '" style="width:100%; height: 100%; "/>').appendTo(this.el);
				$('<i class="fa fa-cloud-upload fa-2x"/><span style="margin-left:4px;display:inline">Drag a file here to upload, or select files</span>').appendTo(dropArea);
				this.selector = $('<input type="file" multiple/>').appendTo(dropArea);
				var progressHolder = $('<div class="progress"/>').appendTo(dropArea);
				//self.percentage = $('<div class="progressCount"/>').appendTo(progressHolder);
				self.percentageBar = $('<div class="progressBar"/>').appendTo(progressHolder);
			
				$('#' + id).on(
					'dragover',
					function(e) {
						e.preventDefault();
						e.stopPropagation();
					}
				);
				$('#' + id).on(
					'dragenter',
					function(e) {
						e.preventDefault();
						e.stopPropagation();
					}
				);
				this.selector.on('change',
					function(e){
						self.uploadFiles(e, e.target.files);
					}
				);
				
				//http://bublv2apitest.azurewebsites.net/api/storage/getuploadurl/?filename=test.jpg
				$('#' + id).on(
					'drop',
					function(e){
						if(e.originalEvent.dataTransfer){
							self.uploadFiles(e, e.originalEvent.dataTransfer.files);   
						}
					}
				);
			},
			
			uploadFiles: function(e, files){
				var self = this;
								
				if(files.length) {
					e.preventDefault();
					e.stopPropagation();
					self.blocks = [];
					
					var file = files[self.fileIndex]
					self.fileIndex++;
					self.percentageBar.css('width', '0%');

					/*UPLOAD FILES HERE*/
					self.file = file;
					self.fileName = self.file.name;
					$.ajax('http://bublv2apitest.azurewebsites.net/api/storage/getuploadurl/?filename=' + self.fileName,
						{
							'success':
								function(data){
									self.uploadUrl = data.uploadUrl;
									self.assetUrl = data.assetUrl;													
									self.uploadFile();
									if(self.fileIndex < files.length){
										self.uploadFiles(e, files);
									} else {
										self.fileIndex = 0;				
									}
								}
						}
					);							
				}	
			},
			
			uploadChunk: function(callback){
				var self = this;
				var reader = new FileReader();
				var sliceStart = self.currentFilePosition;
				var sliceEnd = self.currentFilePosition + self.maxChunkSize;
				var fileSlice = self.file.slice(sliceStart, sliceEnd);
				reader.readAsArrayBuffer(fileSlice);
				if(self.logChunks){
					ZEN.log('read ' + sliceStart + ' to ' + sliceEnd);
					ZEN.log('bytesRemaining = ' + self.bytesRemaining);
				}				
				self.currentFilePosition = self.currentFilePosition + self.maxChunkSize;
				
				
				$(reader).on('loadend',
					function(event){
						if (event.target.readyState == FileReader.DONE) {
			                var data = new Uint8Array(event.target.result);
            
							self.sendBlock(data, function(){
								self.bytesRemaining = self.bytesRemaining - self.maxChunkSize;
								if(self.bytesRemaining <= 0){
									self.sendBlockList(callback);
								} else {
									if(self.bytesRemaining < self.maxChunkSize){
										self.maxChunkSize = self.bytesRemaining; 
									}	
									self.uploadChunk(callback);
								}
							});
						}
					}	
				);
			},
			
			pad: function(number, length) {
				var str = '' + number;
				while (str.length < length) {
					str = '0' + str;
				}
				return(str);
			},
			
			generateBlockID: function(id){
				var self = this;
				return(btoa("block-" + self.pad(self.blockID, 6)).replace(/=/g, 'a'));
			},

			blocks: [],
			
			sendBlock: function(fileSlice, callback){
				var self = this;
				var blockID =  self.generateBlockID(self.blockID);
				self.blocks.push(blockID);
				self.blockID++;
       
				var uri = self.uploadUrl + '&comp=block&blockid=' + blockID;
				
                var requestData = new Uint8Array(fileSlice);
				ZEN.log('send block >> ' + uri + ' (' + requestData.length + ')');
				self.percentageValue = self.currentFilePosition / self.fileSize * 100;
				var percentage = Math.ceil(self.percentageValue);
				if(percentage >100){
					percentage = 100;
				}

				self.percentageBar.css('width', percentage + '%');
				ZEN.log(self.percentageValue + ' % done');
                $.ajax({
                    url: uri,
                    type: "PUT",
                    data: requestData,
                    processData: false,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
                    },
                    success: function (data, status) {
                        console.log(data);
                        console.log(status);
						callback();
                    },
                    error: function(xhr, desc, err) {
                        console.log(desc);
                        console.log(err);
                    }
                });				
			},
			
			sendBlockList: function(callback){
				var self = this;
				var uri = self.uploadUrl + '&comp=blocklist';
				
				ZEN.log('upload block list');
				
			    var requestBody = '<?xml version="1.0" encoding="utf-8"?><BlockList>';
    			for (var i = 0; i < self.blocks.length; i++) {
        			requestBody += '<Latest>' + self.blocks[i] + '</Latest>';
    			}
    			requestBody += '</BlockList>';	
				
				ZEN.log(requestBody);
				
				$.ajax({
        			url: uri,
			        type: "PUT",
			        data: requestBody,
			        beforeSend: function (xhr) {
			            xhr.setRequestHeader('x-ms-blob-content-type', self.fileType);
			        },
			        success: function (data, status) {
			            console.log(data);
			            console.log(status);
						callback();
			        },
			        error: function (xhr, desc, err) {
			            console.log(desc);
			            console.log(err);
			        }
    			});
			},
			
			getSecureUrl: function(callback){
				var self = this;
						
				$.ajax({
                	url: 'http://bublv2apitest.azurewebsites.net/api/storage/getaccessurls/?expiryInMins=100',
                	method: 'POST',
                	contentType: 'application/json',
                	data: "['" + self.assetUrl + "']",
                	success: function(res) {
						callback(res);
                	},
                	error: function(res) {
                    	console.log(res);
                    	alert('Error has occured.');
                	}
            	});						
			},
			
			uploadFile: function(uploadDetails){
				var self = this;
				self.currentFilePosition = 0;
				self.maxChunkSize = 256 * 1024;
				self.bytesRemaining = self.file.size;
				self.blockID = 0;
				self.fileSize = self.file.size;
				self.fileType = self.file.type;
				
				ZEN.log('file dropped');
				ZEN.log('filename = ' + self.file.name);
				ZEN.log('filesize = ' + self.file.size);
				ZEN.log('file chunks = ' + self.file.size / self.maxChunkSize);
				ZEN.log('upload url = ' + self.uploadUrl);
				self.logChunks = false;
				
				self.uploadChunk(
					function(){
						self.getSecureUrl(
							function(urlInfo){
								if(self.asset === undefined){
									bublAssets.add(self.file.name, urlInfo[0].OriginalUrl,
										function(newAsset){
											//alert('done ' + self.asset + ' ' + JSON.stringify(newAsset, null, 4));
											// we need to put page reload here
											bublApp.loadPage('bublAssets');																
										}
									)
								}
							}
						)
					}
				);				
			}
		}
	);

	ZEN.registerType('Uploader', Uploader);

	return {
		Uploader: Uploader
	};
		

}()));
return ZEN;
}(ZEN || {}, _, $));
