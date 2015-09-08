var bublAssets = {
	secureUrls: {},
	pendingSecureUrlRequests: [],
	
	addSecureUrlRequest: function(url){
		var self = this;
		
		if(url.startsWith('https://bubblestore')){
			if(!self.secureUrls.hasOwnProperty(url)){
				self.pendingSecureUrlRequests.push(url); 
			}
		} else {
			self.secureUrls[url] = 'app/' + url;
		}
	},
	processSecureUrlRequests: function(callback){
		var self = this;
		//alert(JSON.stringify(self.pendingSecureUrlRequests));
		
		if(self.pendingSecureUrlRequests.length > 0){
			//alert('do secure url lookup ' + JSON.stringify(self.pendingSecureUrlRequests));
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
	}
}