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
				var objectID = bublApp.getBublID(data.id);
				objectStore.duplicateObject(objectID,
					function(){
						bublApp.loadPage(bublApp.variables['currentpage'], 'fadeIn', 'fadeOut');
					}
				);
			}, 
			delete: function(data){
				var objectID = bublApp.getBublID(data.id);
				objectStore.deleteObject( { 'id': objectID },
					function(){
						bublApp.loadPage(bublApp.variables['currentpage'], 'fadeIn', 'fadeOut');
					}
				);
			},	
			more: function(data){
				var bublID = bublApp.getBublID(data.id);
				bublApp.setCurrentObject(['properties'], bublID,
					function(){
						bublApp.loadPage('properties', 'slideInRight', 'slideOutLeft');
						//popup.show();		
					}	
				);
			},
			advanced: function(){
				bublApp.loadPage('bublTemplateSelector');
			}
		},
		"bublSelector":{
			onLoad: function(data, callback){
				objectStore.getObject('1000', 'withchildren',
					function(loadedData){
						bublApp.findID('bubleGrid', data, 
							function(element){
								ZEN.ui.PagedGrid.populate(loadedData.children, element.children);	
								callback();
							}
						);
					} 
				)
			},
			
			select: function(data){
				var bublID = bublApp.getBublID(data.id);
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
			onLoad: function(data, callback){
				bublApp.findID('bublEditor', data, 
					function(element){
						var layout = bublApp.variables['page'].layout;
						element.children = [layout];
						callback();
					}
				);
			},
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
								ZEN.ui.PagedGrid.populate(loadedData.children, element.children);
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
				var templateID = bublApp.getBublID(data.id);
				
				bublUtil.addBubl(1000, templateID,
					function(bublData, pageData){
						bublApp.setCurrentObject(['bubl'], bublData,
							function(){
								bublApp.setCurrentObject(['page'], pageData,
									function(){
										bublApp.loadPage('bublEditor', 'slideOutRight', 'slideInLeft');		
									}
								)		
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
								ZEN.ui.PagedGrid.populate(loadedData.children, element.children);
								// go knows where the first item is comming from... this is a massive bodge..
								element.children.shift();
								callback();
							}
						);
					} 
				)
			},
			add: function(data){
				alert('add template');
			}
		},
		"bublPages": {
			onLoad(data, callback){
				objectStore.getObject(bublApp.variables['bubl']['id'], 'withchildren',
					function(loadedData){
						bublApp.findID('bublGrid', data, 
							function(element){
								ZEN.ui.PagedGrid.populate(loadedData.children, element.children);
								callback();
							}
						);
					} 
				)
			},
				
			select: function(data){
				bublApp.setCurrentObject(['page'], bublApp.getBublID(data.id),
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
								ZEN.ui.PagedGrid.populate(loadedData.children, element.children);
								// go knows where the first item is comming from... this is a massive bodge..
								element.children.shift();
								callback();
							}
						);
					} 
				)
			},
			select: function(data){
				var templateID = bublApp.getBublID(data.id);
				bublUtil.addPage(bublApp.variables['bubl'].id, templateID,
					function(newPage){
						bublApp.setCurrentObject(['page'], newPage, function(){
							bublApp.loadPage('bublEditor', 'slideOutRight', 'slideInLeft');
						});
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
