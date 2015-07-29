function getBublID(elementID){
	return(elementID.substr(4));
}
	bublApp.actions = {
		'default': {
			ShowPage: function(data){
				bublApp.loadPage(data.object.params.id);
			},
			ShowHelp: function(data){
				alert('show help ' + data.object.params.id);
			},
			back: function(data){
				bublApp.loadPage(bublApp.variables['lastpage'], 'slideInLeft', 'slideOutRight');
			},
			home: function(data){
				bublApp.loadPage('bublSelector', 'fadeIn', 'fadeOut');
			},			
			pages: function(data){	
				bublApp.loadPage('bublPages', 'fadeIn', 'fadeOut');
			},
			duplicate: function(data){
				var objectID = getBublID(data.id);
				objectStore.duplicateObject(objectID,
					function(){
						bublApp.loadPage(bublApp.variables['currentpage'], 'fadeIn', 'fadeOut');
					}
				);
			}, 
			delete: function(data){
				var objectID = getBublID(data.id);
				objectStore.deleteObject( { 'id': objectID },
					function(){
						bublApp.loadPage(bublApp.variables['currentpage'], 'fadeIn', 'fadeOut');
					}
				);
			},	
			more: function(data){
				var bublID = getBublID(data.id);
				bublApp.setCurrentObject(['properties'], bublID,
					function(){
						bublApp.loadPage('properties', 'slideInRight', 'slideOutLeft');
						//popup.show();		
					}	
				);
			}
		},
		"bublSelector":{
			onLoad: function(data, callback){
				objectStore.getObject('1000', 'withchildren',
					function(loadedData){
						bublApp.findID('bubleGrid', data, 
							function(element){
								ZEN.ui.Grid.populate(loadedData.children, element.children);	
								callback();
							}
						);
					} 
				)
			},
			
			select: function(data){
				var bublID = getBublID(data.id);
				bublApp.setCurrentObject(['bubl', 'edit'], bublID,
					function(){
						bublApp.loadPage('bublPages', 'slideInRight', 'slideOutLeft');		
					}	
				);
			},
			
			add: function(data){
				objectStore.getNextOrder(1000,
					function(orderData){
						bublApp.variables['newBublTitle'] = 'New bubl ' + orderData.nextorder; 
						ZEN.log('set newBublTitle = ' + bublApp.variables['newBublTitle']);
						bublApp.loadPage('bublNew', 'slideInRight', 'slideOutLeft');
					}
				);						
			},
			
			share: function(data){
				bublApp.loadPage('bublShare');
			}
		},
		"bublEditor":{
			cancel: function(){
				bublApp.loadPage('bublPages', 'fadeIn', 'fadeOut');
			},
			save: function(){
				bublApp.loadPage('bublPages', 'fadeIn', 'fadeOut');				
			}
		},
		"bublNew":{
			onLoad: function(data, callback){
				var self = this;
				objectStore.getObject('2000', 'withchildren',
					function(loadedData){
						bublApp.findID('bubleGrid', data, 
							function(element){
								ZEN.ui.Grid.populate(loadedData.children, element.children);
								// go knows where the first item is comming from... this is a massive bodge..
								element.children.shift();
								callback();
							}
						);
					} 
				)
			},
			select: function(data){
				var self = this;
				var templateID = getBublID(data.id);
				var templateThumbnail = data.params.content.imageurl;

				objectStore.upsertObject(
					{
						'parentId': '1000',
						'title': bublApp.variables['newBublTitle'],
						'description': 'To edit these details click the \'...\' button below.',
						'thumbnail': templateThumbnail,
						'template': templateID
					},
					function(insertedData){
						var bublID = insertedData['id'];
						bublApp.setCurrentObject(['bubl'], insertedData,
							function(){
								objectStore.upsertObject(
									{
										'parentId': bublID,
										'title': bublApp.variables['newBublTitle'] + ' - Page 1',
										'description': 'Description of page', 	
										'thumbnail': templateThumbnail,
										'template': templateID
									},
									function(insertedData){
										bublApp.setCurrentObject(['page'], insertedData,
											function(){						
												bublApp.loadPage('bublEditor', 'slideInRight', 'slideOutLeft');
											}
										);						
									}
								);
							}
						);
					}
				);		
			}
		},
		"bublTemplateSelector": {
			onLoad: function(data, callback){
				objectStore.getObject('2000', 'withchildren',
					function(loadedData){
						bublApp.findID('bubleGrid', data, 
							function(element){
								ZEN.ui.Grid.populate(loadedData.children, element.children);
								// go knows where the first item is comming from... this is a massive bodge..
								element.children.shift();
								callback();
							}
						);
					} 
				)
			}
		},
		"bublPages": {
			onLoad(data, callback){
				objectStore.getObject(bublApp.variables['bubl']['id'], 'withchildren',
					function(loadedData){
						bublApp.findID('bublGrid', data, 
							function(element){
								ZEN.ui.Grid.populate(loadedData.children, element.children);
								callback();
							}
						);
					} 
				)
			},
				
			select: function(data){
				bublApp.setCurrentObject(['page'], getBublID(data.id),
					function(){
						bublApp.loadPage('bublEditor');				
					}	
				);
			},
			
			add: function(data){
				objectStore.getNextOrder(bublApp.variables['bubl'].id,
					function(orderData){
						bublApp.variables['newBublPageTitle'] = bublApp.variables['bubl'].title + ' - Page ' + orderData.nextorder; 
						ZEN.log('set newBublPageTitle = ' + bublApp.variables['newBublPageTitle']);
						bublApp.loadPage('bublPageNew', 'slideInRight', 'slideOutLeft');
					}
				);						
			}
		},
		'bublPageNew':{
			onLoad: function(data, callback){
				objectStore.getObject('2000', 'withchildren',
					function(loadedData){
						bublApp.findID('bubleGrid', data, 
							function(element){
								ZEN.ui.Grid.populate(loadedData.children, element.children);
								// go knows where the first item is comming from... this is a massive bodge..
								element.children.shift();
								callback();
							}
						);
					} 
				)
			},
			select: function(data){
				var templateID = getBublID(data.id);
				var templateThumbnail = data.params.content.imageurl;
				
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
								bublApp.loadPage('bublPages', 'slideOutRight', 'slideInLeft');						
							}
						);						
					}	
				);
			}
		},
		"properties": {
			afterLoad: function(data, callback){
				var self = this;
				objectStore.getObject(bublApp.variables['properties']['id'], 'withdescendents',
					function(object){
						if(object['children']){
							delete object['children'];
						}
						var editor = ZEN.objects['BublEditor'];
						ZEN.log('editor = ', editor);
						editor.setContent(JSON.stringify(object, null, 4));
						callback();
					}	
				);
			},
			
			save: function(data){
				objectStore.upsertObject(JSON.parse(ZEN.objects['BublEditor'].getContent()),
					function(){
						bublApp.loadPage(bublApp.variables['lastpage'], 'slideInLeft', 'slideOutRight');
					}
				);
			},
			
			cancel: function(){
				bublApp.loadPage(bublApp.variables['lastpage'], 'slideInLeft', 'slideOutRight');
			}
		}
	};
