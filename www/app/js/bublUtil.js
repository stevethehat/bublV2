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
								'template': templateID
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
										'layout': template.layout
									},
									function(insertedData){
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

	addTemplate: function(callback){
		objectStore.getNextOrder(2000,
			function(nextOrder){
				objectStore.upsertObject(
					{
						'parentId': '2000',
						'title': 'Template ' + nextOrder.nextorder,
						'order': nextOrder.nextorder,
						'description': 'Description of the template',
						'thumbnail': 'img/layout1.png',
						'layout': {}
					},
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
	}
}