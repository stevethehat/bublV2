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
						bublUtil.findID('bubleGrid', data, 
							function(element){
								ZEN.ui.PagedGrid.populate(loadedData, element.children, null, callback);	
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
				bublEditor.load(data, callback);
			},
			save: function(){
				var content = ZEN.objects['BublPageRoot'].serialize();
				var page = bublApp.variables['page']; 
				page.layout = content.params;
				if(!page.thumbnails){
					page.thumbnails = {};
				}
				var thumbnail = 'img/assets/340x200/' + page.id + '-thumbnail.png?rqsb=' + new Date().getTime();
				page.thumbnails['340x200'] = thumbnail;
				var pageData = bublApp.variables['page'];
				
				bublUtil.generateThumbnail(page.id,
					function(thumbnailData){	
						pageData['majorColor'] = thumbnailData['info']['majorColor'];
						pageData['contrastColor'] = thumbnailData['info']['contrastColor'];
						objectStore.upsertObject(pageData,
							function(savedData){
								bublApp.dump('savedpage', savedData);

								if(Number(page.order) === 1){
									var bublUpdateData = { 
										'thumbnails': { '340x200': thumbnail },
										'majorColor': pageData['majorColor'],
										'contrastColor': pageData['contrastColor']
									};
									objectStore.updateObject(page.parentId, 
										bublUpdateData,
										function(){
											bublApp.loadPage('bublPages', 'fadeIn', 'fadeOut');																						
										}
									);							
								} else {
									bublApp.loadPage('bublPages', 'fadeIn', 'fadeOut');																				
								}
							}
						);
					}
				);
			},
			preview: function(data){
				var bublID = bublApp.variables['page'].id;
				window.open('index.html?id=' + bublID, '_blank');
			},
			source: function(data){
				var bublID = bublApp.variables['page'].id;
				bublApp.setCurrentObject(['properties'], bublID,
					function(){
						bublApp.loadPage('rawproperties', 'slideInRight', 'slideOutLeft');
						//popup.show();		
					}	
				);
			},
			cancel: function(data){
				bublApp.loadPage('bublPages', 'slideInLeft', 'slideOutRight');
			},
			addcontrol: function(data){
				bublEditor.addControl(data);
			},
			savecontrol: function(data){
				bublEditor.saveControl(data);
			},
			deletecontrol: function(data){
				bublEditor.deleteControl(data);
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

				//alert(JSON.stringify(parent.params, null, 4));				
				bublApp.setCurrentObject(['contentelement'], parent,
					function(){
						bublEditor.showPropertiesForCurrentElement();
						//ZEN.objects['BublElementEditor'].setContent(JSON.stringify(parent.params, null, 4));
					}
				);
			}
		},
		"bublNew":{
			onLoad: function(data, callback){
				var self = this;
				objectStore.getObject('2000', 'withchildren',
					function(loadedData){
						bublUtil.findID('bubleGrid', data, 
							function(element){
								ZEN.ui.PagedGrid.populate(loadedData, element.children, null, callback);
								// go knows where the first item is comming from... this is a massive bodge..
								/*
								if(element.children.length > 1){
									element.children.shift();								
								}
								*/
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
						bublUtil.findID('bubleGrid', data, 
							function(element){
								ZEN.ui.PagedGrid.populate(loadedData, element.children, null, callback);
								// go knows where the first item is comming from... this is a massive bodge..
								/*
								if(element.children.length > 1){
									element.children.shift();	
								}
								*/							
							}
						);
					} 
				)
			},
			select: function(data){
				bublApp.setCurrentObject(['properties'], bublApp.getBublID(data.id),
					function(){
						bublApp.loadPage('bublTemplateEditor');				
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
			onLoad: function(data, callback){
				objectStore.getObject(bublApp.variables['bubl']['id'], 'withchildren',
					function(loadedData){
						bublUtil.findID('bublGrid', data, 
							function(element){
								ZEN.ui.PagedGrid.populate(loadedData, element.children, null, callback);
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
			},
			
			preview: function(data){
				alert('preview');
				window.open('index.html?id=' + bublApp.getBublID(data.id), '_blank');
			},
		},
		
		'bublPageNew':{
			onLoad: function(data, callback){
				objectStore.getObject('2000', 'withchildren',
					function(loadedData){
						bublUtil.findID('bubleGrid', data, 
							function(element){
								ZEN.ui.PagedGrid.populate(loadedData, element.children, null, callback);
								// go knows where the first item is comming from... this is a massive bodge..
								/*
								if(element.children.length > 1){
									element.children.shift();
								}
								*/
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
						bublUtil.findID('bublGrid', data, 
							function(element){
								ZEN.ui.PagedGrid.populate(loadedData, element.children, 'desc', callback);	
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
				bublAssets.add(null,
					function(newPage){
						bublApp.loadPage('bublAssets', 'slideInRight', 'slideOutLeft');		
					}	
				);				
			},
			
			info: function(data){
				var self = this;
				
				alert('image info');
			}
		},
		"properties": {
			onLoad: function(data, callback){
				var self = this;
				objectStore.getObject(bublApp.variables['properties']['id'], 'withdescendents',
					function(object){
						if(object['children']){
							delete object['children'];
						}
						
						bublUtil.findID('propertiesForm', data, 
							function(formView){
								bublForm.insertForm(formView, { 'params' : object }, object.type + '.json', 
									function(){
										bublApp.preParse(data, {});
										callback();
									}	
								);
							}
						);
						
						//bublForm.showForm('propertiesForm', object, object.type + '.json');
						//callback();
					}	
				);
			},
			
			save: function(data){
				var paramsObject = { 'params' : bublApp.variables['properties'] };
				bublForm.updateObject(paramsObject);
				
				objectStore.upsertObject(paramsObject.params, 
					function(upsertedData){
						bublApp.loadPage(bublApp.variables['lastpage'], 'slideInLeft', 'slideOutRight');
					}	
				)
			},
			
			cancel: function(){
				bublApp.loadPage(bublApp.variables['lastpage'], 'slideInLeft', 'slideOutRight');
			}
		},
		"rawproperties": {
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
		},
		"bublTemplateEditor": {
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
			
			preview: function(){
				var bublID = bublApp.variables['properties']['id'];
				window.open('index.html?id=' + bublID, '_blank');
			},			
			
			save: function(data){
				var template = JSON.parse(ZEN.objects['BublEditor'].getContent());
				template.thumbnail = 'img/assets/340x200/' + template.id + '-thumbnail.png?rqsb=' + new Date().getTime();

				objectStore.upsertObject(template,
					function(savedData){
						bublUtil.generateThumbnail(savedData.id,
							function(){
								bublApp.loadPage(bublApp.variables['lastpage'], 'slideInLeft', 'slideOutRight');
							}
						);
					}
				);				
				/*
				objectStore.upsertObject(JSON.parse(ZEN.objects['BublEditor'].getContent()),
					function(){
						bublApp.loadPage(bublApp.variables['lastpage'], 'slideInLeft', 'slideOutRight');
					}
				);
				*/
			},
			
			cancel: function(){
				bublApp.loadPage(bublApp.variables['lastpage'], 'slideInLeft', 'slideOutRight');
			}
		}

	};
