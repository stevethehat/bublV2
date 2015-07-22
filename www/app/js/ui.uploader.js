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

		_.extend(
			Uploader.prototype,
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

					var id = this.el.attr('id') + 'uploaded';	
					var dropArea = $('<div class="uploader" id="' + id + '" style="width:100%; height: 100%; "/>').appendTo(this.el);
					$('<span><i class="fa fa-cloud-upload fa-2x"/> Drag file here to upload</span>').appendTo(dropArea);
					var progressHolder = $('<div class="progress"/>').appendTo(dropArea);
					self.percentage = $('<span/>').appendTo(progressHolder);
				
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
					//http://bublv2apitest.azurewebsites.net/api/storage/getuploadurl/?filename=test.jpg
					$('#' + id).on(
					    'drop',
					    function(e){
					        if(e.originalEvent.dataTransfer){
					            if(e.originalEvent.dataTransfer.files.length) {
					                e.preventDefault();
					                e.stopPropagation();
					                /*UPLOAD FILES HERE*/
									self.file = e.originalEvent.dataTransfer.files[0];
									self.fileName = self.file.name;				
									$.ajax('http://bublv2apitest.azurewebsites.net/api/storage/getuploadurl/?filename=' + self.fileName,
										{
											'success':
												function(data){
													alert(JSON.stringify(data, null, 4));
													self.uploadUrl = data.uploadUrl;
													//self.uploadUrl = data.uploadUrl.replace('https://bubblestore.blob.core.windows.net', 'http://localhost:3001');
													alert(self.uploadUrl);
													// replace https://bubblestore.blob.core.windows.net
													// with http://localhost:3000
													
													self.uploadFile();
													/*
													$.get('api/upload/init', {
														'uploadUrl': data.uploadUrl,
														function(){
															alert('done init');
															self.uploadFile(data);
														}	
													});*/
												}
										}
									);
					            }   
					        }
					    }
					);
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

			sendBlock: function(fileSlice, callback){
				var self = this;
				var blockID =  self.generateBlockID(self.blockID);
				self.blockID++;
       
				var uri = self.uploadUrl + '/block?comp=block&blockid=' + blockID;
				alert(uri);
				
                var requestData = new Uint8Array(fileSlice);
				ZEN.log('send block >> ' + uri + ' (' + requestData.length + ')');
				self.percentageValue = self.currentFilePosition / self.fileSize * 100;
				self.percentage.text(self.percentageValue + ' %');
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
    			for (var i = 0; i < self.blockID; i++) {
        			requestBody += '<Latest>' + self.generateBlockID(i) + '</Latest>';
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
			
			uploadFile: function(uploadDetails){
				var self = this;
				//self.uploadUrl = uploadDetails.uploadUrl.substr(8);
				//self.uploadUrl = 'http://localhost:3000/api/upload';
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
						alert('done');
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
