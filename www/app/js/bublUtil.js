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
										'type': 'page'
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

	addAsset: function(callback){
		objectStore.getNextOrder(3000,
			function(nextOrder){
				objectStore.upsertObject(
					{
						'parentId': '3000',
						'title': 'Asset ' + nextOrder.nextorder,
						'order': nextOrder.nextorder,
						'description': 'Description of the asset',
						'thumbnail': 'img/defaults/newasset.png',
						'type': 'asset'
					},
					function(insertedData){
						callback(insertedData);
					}
				);													
			}	
		);
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
						'type': 'template',
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
	},
	
	generateThumbnail: function(id, callback){
		var data = {
			'url': 'http://localhost:3000/index.html?id=' + id,
			'fileName': id + '-thumbnail.png',
			'width': 340,
			'height': 200,
			'delay': 1000
		}
		/*
		$.post('api/media/capture',
			data,
			function(){
				alert('thumbnail callback');
				callback();	
			}
		);
		*/
		
		/*
		$.ajax({
			url: 'api/media/capture',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			dataType: 'json',
			success: function(returnData){
				alert('ok ' + returnData);
				callback();
			},
			error: function(returnData){
				alert('error ' + returnData);
				callback();
			}
		});
		*/
		
		$.ajax({
			url: 'api/media/capture',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			dataType: 'json',
			complete: function(returnData){
				callback();
			}		
		});
	}
}