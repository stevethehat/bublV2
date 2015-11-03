var bublUtil = {
	addBubl: function(parentID, templateID, callback){
		var self = this;
		objectStore.getObject(templateID, null,
			function(template){
				var templateThumbnail = template.thumbnail;
				objectStore.getNextOrder(parentID,
					function(nextOrder){
						objectStore.upsertObject(
							{
								'parentId': '1000',
								'title': 'New bubl ' + nextOrder.nextorder,
								'order': nextOrder.nextorder,
								'description': 'To edit these details click the \'...\' button below.',
								'thumbnail': templateThumbnail,
								'template': templateID,
								'type': 'bubl'
							},
							function(bublData){
								var bublID = bublData['id'];
								self.addPage(bublID, templateID, 
									function(pageData){
										callback(bublData, pageData);
									}	
								);
							}
						);		
					}
				);
			}	
		);
	},
	
	addPage: function(bublID, templateID, callback){
		objectStore.getObject(templateID, null,
			function(template){
				var templateThumbnail = template.thumbnail;
				
				objectStore.getNextOrder(bublID,
					function(nextOrder){
						objectStore.getObject(bublID, null, 
							function(bublData){
								objectStore.upsertObject(
									{
										'parentId': bublID,
										'title': bublData.title + ' - Page ' + nextOrder.nextorder,
										'order': nextOrder.nextorder,
										'description': 'Description of the page',
										'thumbnail': templateThumbnail,
										'template': templateID,
										'layout': template.layout,
										'type': 'page',
										'css': template.css
									},
									function(insertedData){
										bublApp.dump('newpage', insertedData);

										callback(insertedData);
									}
								);													
							}	
						);
					}	
				);
		
			}	
		)		
	},
	

	addTemplate: function(callback, defaultObject){
		objectStore.getNextOrder(2000,
			function(nextOrder){
				var templateData = {};
				if(defaultObject !== undefined){
					templateData = defaultObject;
					delete templateData['id'];
				} else {
					templateData['layout'] = {};
				}
				templateData['parentId'] = '2000';
				templateData['title'] = 'Template ' + nextOrder.nextorder;
				templateData['order'] = nextOrder.nextorder;
				templateData['description'] = 'Description of the template';
				templateData['thumbnail'] = 'img/layout1.png';
				templateData['type'] = 'template';
				
				objectStore.upsertObject(templateData,
					function(insertedData){
						callback(insertedData);
					}
				);													
			}	
		);
	},
	
	previousSibling: function(element){
		var parent = element.parent;
		var result = null;
		var found = false;
		_.each(parent.children,
			function(sibling){
				if(!found){
					if(sibling.id === element.id){
						ZEN.log('found ' + sibling.id + ' = ' + element.id);
						found = true;
					} else {
						ZEN.log('NOT found');
						result = sibling;
					}
				}
			}
		);
		alert(JSON.stringify(result.params));
		return(result);
	},
	
	generateThumbnail: function(id, callback){
		var data = {
			'url': 'http://localhost:3000/player.html?id=' + id,
			'fileName': id + '-thumbnail.png',
			'width': 340,
			'height': 200,
			'delay': 3000
		}
		
		$.ajax({
			url: 'api/media/capture',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			dataType: 'json',
			complete: function(returnData){
				callback(returnData['responseJSON']);
			}		
		});
	},
	findID: function(id, data, callback){
		var self = this;
		if(data !== undefined){			
			if(data.id && data.id === id){
				ZEN.log('found ID');
				callback(data);
			} else {
				var children = data.children;
				if(children === undefined){
					children = data.fields;
				}
				if(children){
					_.each(children,
						function(element){
							self.findID(id, element, callback);
						}
					);
				} else {
					if(_.isObject(data)){
						for(var oName in data){
							self.findID(id, data[oName], callback);
						}
					}
				}
			}
		} else {
			ZEN.log('no data supplied to findID');
			callback(null);
		}
	},
	recurseTree: function(root, callback){
		var self = this;
		callback(root);
		if(root['children']){
			_.each(root['children'], 
				function(child){
					self.recurseTree(child, callback);	
				}
			);
		}
	}
}