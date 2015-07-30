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
	}
}