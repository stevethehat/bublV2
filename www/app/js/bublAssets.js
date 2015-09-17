var bublAssets = {
	secureUrls: {},
	pendingSecureUrlRequests: [],
	
	addSecureUrlRequest: function(url){
		var self = this;
		
		if(url !== undefined && url !== null){
			if(url.startsWith('https://bubblestore')){
				if(!self.secureUrls.hasOwnProperty(url)){
					self.pendingSecureUrlRequests.push(url); 
				}
			} else {
				self.secureUrls[url] = 'app/' + url;
			}			
		}
	},
	processSecureUrlRequests: function(callback){
		var self = this;
		
		if(self.pendingSecureUrlRequests.length > 0){
			$.ajax({
				url: 'http://bublv2apitest.azurewebsites.net/api/storage/getaccessurls/?expiryInMins=100',
				method: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(self.pendingSecureUrlRequests),
				success: function(res) {
					for(var i=0; i < res.length;i++){
						var secureUrl = res[i];
						self.secureUrls[secureUrl.OriginalUrl] = secureUrl.UrlWithSasKey;
					}
					self.pendingSecureUrlRequests = [];	
					//alert(JSON.stringify(self.secureUrls, null, 4));
					callback();
				},
				error: function(res) {
					console.log(res);
					alert('Error has occured.');
				}
			});
		} else {
			callback();
		}									
	},
	
	getSecureUrl: function(url){
		var self = this;
		var secureUrl = '';
		if(self.secureUrls.hasOwnProperty(url)){
			secureUrl = self.secureUrls[url];
		} else {
			if(!url.startsWith('http')){
				secureUrl = 'app/' + url
				self.secureUrls[url] = secureUrl;
			}
		}	
		return(secureUrl);		
	},
	
	lookupSecureUrl: function(url, callback){
		var self = this;
		self.addSecureUrlRequest(url);
		self.processSecureUrlRequests(
			function(){
				var secureUrl = self.secureUrls[url];
				callback(secureUrl);
			}
		);
	},
	
	getFileName: function(uri){
		return(uri.substr(uri.lastIndexOf('/') +1));	
	},
	
	add: function(fileName, url, callback){
		var self = this;
		objectStore.getNextOrder(3000,
			function(nextOrder){
				var thumbnail = 'img/defaults/newasset.png';
				if(url !== undefined && url !== null){
					thumbnail = url;
				}
				var newAsset = {
					'parentId': '3000',
					'title': 'Asset ' + nextOrder.nextorder,
					'order': nextOrder.nextorder,
					'description': fileName,
					'thumbnails': {'340x200': 'img/defaults/generatingthumbnail.png'},
					'url': url,
					'type': 'asset'
				};
					
				self.lookupSecureUrl(url,
					function(secureUrl){
						self.generateThumbnails(secureUrl,
							function(thumbnailInfo){
								_.each(thumbnailInfo['responseJSON']['response'],
									function(thumbnail){
										var majorColor = thumbnail['majorColor'];
										if(majorColor !== undefined){
											newAsset['majorColor'] = majorColor;
										}
										var contrastColor = thumbnail['contrastColor'];
										if(contrastColor !== undefined){
											newAsset['contrastColor'] = contrastColor;
										}
										newAsset['thumbnails'][thumbnail.width + 'x' + thumbnail.height] = thumbnail.url
									}
								)
								
								//alert('add asset ' + JSON.stringify(newAsset, null, 4));
								
								objectStore.upsertObject(
									newAsset, callback								
								);														
							}
						);
					}
				);
			}	
		);
	},
	
	generateThumbnails: function(uri, callback){
		var data = {
			'uri': uri,
			'sizes': ['340x200', '200x100']
		}
		$.ajax({
			url: 'api/media/thumbnails',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			dataType: 'json',
			complete: function(returnData){
				//alert(JSON.stringify(returnData['responseJSON'], null, 4));
				callback(returnData);
			}		
		});
	}
}