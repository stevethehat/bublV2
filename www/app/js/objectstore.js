			
			
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
					//alert(JSON.stringify(returnData, null, 4));
					callback(returnData);
				}
			});
		},
		
		updateObject: function(objectID, updateObject, callback){
			var self = this;
			
			self.getObject(objectID, null,
				function(object){
					object = _.extend(object, updateObject);
					//alert('update object ' + JSON.stringify(object, null, 4));
					self.upsertObject(object,
						function(){
							callback();
						}	
					);					
				}	
			);
		},
		
		duplicateObject: function(objectID, callback){
			var self = this;
			
			self.getObject(objectID, null,
				function(object){
					delete object['_id'];
					delete object['id'];
					self.upsertObject(object,
						function(){
							callback();
						}	
					);					
				}	
			);
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
		},
		
		getNextOrder: function(objectID, callback){
			var self = this;

   			$.ajax({
        		url: self.apiRoot + '/' + objectID + '/nextorder',
        		contentType: 'application/json',
        		dataType: 'json',
				success: function(returnData){
					callback(returnData);
				}
			});
			
		}
	};
//});
