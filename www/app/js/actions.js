	bublApp.actions = {
		'default': {
			ShowPage: function(data){
				bublApp.loadPage(data.object.params.id);
			},
			ShowHelp: function(data){
				alert('show help ' + data.object.params.id);
			},
			home: function(data){
				bublApp.loadPage('home', 'fadeIn', 'fadeOut');
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
			},
			gridprevious: function(){
				bublApp.variables['gridcurrentpage'] = bublApp.variables['gridcurrentpage'] -1;
				bublApp.loadPage(bublApp.variables['currentpage'], 'fadeIn', 'fadeOut');
			},
			gridnext: function(){
				bublApp.variables['gridcurrentpage'] = bublApp.variables['gridcurrentpage'] +1;
				bublApp.loadPage(bublApp.variables['currentpage'], 'fadeIn', 'fadeOut');
			}
		},
		"home":{
			select: function(data){
				switch(data.id){
					case 'bubls':
						bublApp.loadPage('bublSelector');
						break;
					case 'assets':
						bublApp.loadPage('bublAssets');
						break;
					case 'templates':
						bublApp.loadPage('bublTemplateSelector');
						break;
					case 'users':
						alert('goto user management');
						break;
				}
			}	
		},
		"bublSelector":{
			onLoad: function(data, callback){
				objectStore.getObject('1000', 'withchildren',
					function(loadedData){
						bublApp.findID('bubleGrid', data, 
							function(element){
								ZEN.ui.PagedGrid.populate(loadedData, element.children);	
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
			save: function(){
				var content = ZEN.objects['BublPageRoot'].serialize();
				bublApp.variables['page'].layout = content.params;
				
				objectStore.upsertObject(bublApp.variables['page'],
					function(savedData){
						bublApp.dump('savedpage', savedData);
						bublApp.loadPage('bublPages', 'fadeIn', 'fadeOut');						
					}
				)
				//ZEN.log('bubl page content = ', JSON.stringify(content, null, 4));
			},
			source: function(data){
				alert('show source');
				var bublID = bublApp.variables['page'].id;
				bublApp.setCurrentObject(['properties'], bublID,
					function(){
						bublApp.loadPage('properties', 'slideInRight', 'slideOutLeft');
						//popup.show();		
					}	
				);
			},
			cancel: function(data){
				bublApp.loadPage('bublPages', 'slideInLeft', 'slideOutRight');
			},
			addcontrol: function(data){
				var contentArea = bublApp.variables['contentelement'];
				ZEN.log('add control', bublApp.variables);
				var parentID = contentArea.parent.id;
				contentArea.remove(true);
				ZEN.cleanup();
				
				var newControl = ZEN.parse({ 'type': data.params.content.addtype }, ZEN.objects[parentID]);
				ZEN.objects[parentID].show(true);
				ZEN.objects['bublEditor'].resize(true);		
				
				ZEN.notify ("ui.bublcontrol", { 'source': newControl });		
			},
			savecontrol: function(data){
				var self = this;
				var element = bublApp.variables['contentelement'];
				//var content = JSON.parse(ZEN.objects['BublElementEditor'].getContent());
				var parentID = element.parent.id;
				
				bublForm.save(element);
				content = element.params;
				 				
				element.remove(true);
				ZEN.cleanup();

				var parsedData = bublApp.preParse(content);
				var o = ZEN.parse(parsedData, ZEN.objects[parentID]);
				ZEN.objects[parentID].show(true);
				ZEN.objects['bublEditor'].resize(true);				
			},
			parentcontrol: function(data){
				function getParent(element){
					if(element.parent.params.autoadded === true){
						return(getParent(element.parent));
					} else {
						return(element.parent);
					}
				}
				var element = bublApp.variables['contentelement'];
				var parent = getParent(element);				
				
				bublApp.setCurrentObject(['contentelement'], parent,
					function(){
						ZEN.objects['BublElementEditor'].setContent(JSON.stringify(parent.params, null, 4));
					}
				);
			}
		},
		"bublNew":{
			onLoad: function(data, callback){
				var self = this;
				objectStore.getObject('2000', 'withchildren',
					function(loadedData){
						bublApp.findID('bubleGrid', data, 
							function(element){
								ZEN.ui.PagedGrid.populate(loadedData, element.children);
								// go knows where the first item is comming from... this is a massive bodge..
								/*
								if(element.children.length > 1){
									element.children.shift();								
								}
								*/
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
								ZEN.ui.PagedGrid.populate(loadedData, element.children);
								// go knows where the first item is comming from... this is a massive bodge..
								/*
								if(element.children.length > 1){
									element.children.shift();	
								}
								*/							
								callback();
							}
						);
					} 
				)
			},
			select: function(data){
				bublApp.setCurrentObject(['properties'], bublApp.getBublID(data.id),
					function(){
						bublApp.loadPage('properties');				
					}	
				);
			},
			add: function(data){
				bublUtil.addTemplate(
					function(templateData){
						bublApp.loadPage('bublTemplateSelector');				
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
								ZEN.ui.PagedGrid.populate(loadedData, element.children);
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
								ZEN.ui.PagedGrid.populate(loadedData, element.children);
								// go knows where the first item is comming from... this is a massive bodge..
								/*
								if(element.children.length > 1){
									element.children.shift();
								}
								*/
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
		"bublAssets": {
			onLoad: function(data, callback){
				objectStore.getObject('3000', 'withchildren',
					function(loadedData){
						bublApp.findID('bublGrid', data, 
							function(element){
								ZEN.ui.PagedGrid.populate(loadedData, element.children);	
								callback();
							}
						);
					} 
				)
			},
			
			select: function(data){
				var bublID = bublApp.getBublID(data.id);
				bublApp.setCurrentObject(['properties', 'edit'], bublID,
					function(){
						bublApp.loadPage('properties', 'slideInRight', 'slideOutLeft');		
					}	
				);
			},
			
			add: function(data){
				bublUtil.addAsset(
					function(newPage){
						bublApp.loadPage('bublAssets', 'slideInRight', 'slideOutLeft');		
					}	
				);				
			},
			
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
