			
			
			//$(function() {

	var objectStore = {
		apiRoot: location.protocol + '//' + location.host + '/api/objects',

		getObject: function(objectID, subObjects, callback){
			var url = location.protocol + '//' + location.host + '/api/objects/' + objectID;
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
			
			var objectData = null;
			try{
				objectData = JSON.stringify(object);
			} catch (e){
				var result = self.findCircularObject(object);
				alert('cr error ' + result);
				objectData = null;
			}	
			
			if(objectData !== null){
				$.ajax({
					url: self.apiRoot,
					type: 'POST',
					contentType: 'application/json',
					data: objectData,
					dataType: 'json',
					success: function(returnData){
						ZEN.log('returned data');
						ZEN.log(returnData);
						//alert(JSON.stringify(returnData, null, 4));
						callback(returnData);
					}
				});				
			}			
		},
	
		findCircularObject: function(node, parents, tree){
			parents = parents || [];
			tree = tree || [];

			if (!node || typeof node != "object")
				return false;
		
			var keys = Object.keys(node), i, value;
		
			parents.push(node); // add self to current path
			for (i = keys.length - 1; i >= 0; i--){
				value = node[keys[i]];
				if (value && typeof value == "object") {
					tree.push(keys[i]);
					if (parents.indexOf(value) >= 0)
						return true;
					// check child nodes
					if (arguments.callee(value, parents, tree))
						return tree.join('.');
					tree.pop();
				}
			}
			parents.pop();
			return false;
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
