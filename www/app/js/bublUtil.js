var bublUtil = {
	addPage: function(bublID, templateID, callback){
		objectStore.getObject(templateID, null,
			function(template){
				var templateThumbnail = template.thumbnail;
				
				objectStore.getNextOrder(bublApp.variables['bubl'].id,
					function(nextOrder){
						objectStore.upsertObject(
							{
								'parentId': bublApp.variables['bubl'].id,
								'title': bublApp.variables['bubl'].title + ' - Page ' + nextOrder.nextorder,
								'description': 'Description of the page',
								'thumbnail': templateThumbnail,
								'template': templateID
							},
							function(insertedData){
								callback(insertedData);
							}
						);						
					}	
				);
		
			}	
		)		
	}
}