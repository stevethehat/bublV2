			
			
			//$(function() {

	var objectStore = {
		apiRoot: 'http://localhost:3000/api/objects',

		getObject: function(objectID, subObjects, callback){
			var url = 'http://localhost:3000/api/objects/' + objectID;
			if(subObjects !== null && subObjects !== ''){
				url = url + '/' + subObjects;
			} 				
			ZEN.data.load(
				url, {},
				function(data){
					callback(data);
				}
			);
		},
		
		upsertObject: function(object, callback){
			var self = this;
			
			ZEN.log('posting');
			ZEN.log(object);		
			
			if(object['children']){
				delete object['children'];
			}	
			
   			$.ajax({
        		url: self.apiRoot,
        		type: 'POST',
        		contentType: 'application/json',
        		data: JSON.stringify(object),
        		dataType: 'json',
				success: function(returnData){
					ZEN.log('returned data');
					ZEN.log(returnData);
					callback(returnData);
				}
			});
		},
		
		deleteObject: function(object, callback){
			var self = this;
			
			ZEN.log('deleting');
			ZEN.log(object);			
			
   			$.ajax({
        		url: self.apiRoot + '/' + object['id'],
        		type: 'DELETE',
        		contentType: 'application/json',
        		data: JSON.stringify(object),
        		dataType: 'json',
				success: function(returnData){
					ZEN.log('returned data');
					ZEN.log(returnData);
					callback(returnData);
				}
			});
		}
	};
//});
