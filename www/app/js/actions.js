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
			}
		},
		'home': {
			
			
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
				var selectorBack = $('#' + data.id + ' .back');
				bublApp.variables['bublBackgroundColor'] = selectorBack.css('background-color');
				bublApp.variables['bublColor'] = selectorBack.css('color');

				var bublID = getBublID(data.id);
				bublApp.setCurrentBubl(bublID,
					function(){
						bublApp.loadPage('bublEditor', 'slideInRight', 'slideOutLeft');		
					}	
				);
			},
			
			add: function(data){
				/*
				objectStore.upsertObject(
					{
						'parentId': '1000',
						'title': 'New bubl',
						'description': 'To edit these details click the \'...\' button below.',
						'thumbnail': 'img/acricketer.png'
					},
					function(insertedData){
						bublApp.variables['bublid'] = insertedData['id'];
						bublApp.variables['bubltitle'] = insertedData['title'];
						bublApp.setCurrentBubl(insertedData,
							function(){
								bublApp.loadPage('bublTemplateSelector', 'slideInRight', 'slideOutLeft');						
							}
						);
					}
				);
				*/
				bublApp.loadPage('bublNew', 'slideInRight', 'slideOutLeft');						

				//bublApp.loadPage('bublshare');
			},
			
			share: function(data){
				bublApp.loadPage('bublShare');
			},
			
			duplicate: function(data){
				alert('duplicate');
			},
			
			delete: function(data){
				var bublID = getBublID(data.id);
				objectStore.deleteObject( { 'id': bublID },
					function(){
						bublApp.loadPage('bublSelector', 'fadeIn', 'fadeOut');
					}
				);
			},
			
			more: function(data){
				var bublID = getBublID(data.id);
				bublApp.setCurrentBubl(bublID,
					function(){
						bublApp.loadPage('bublProperties', 'slideInRight', 'slideOutLeft');		
					}	
				);
			}
		},
		"bublEditor":{
			showPages: function(){
				bublApp.loadPage('bublPages', 'fadeIn', 'fadeOut');
			}
		},
		"bublNew":{
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
				alert(JSON.stringify(data.serialize(), null, 4));
				objectStore.upsertObject(
					{
						'parentId': '1000',
						'title': 'New bubl',
						'description': 'To edit these details click the \'...\' button below.',
						'thumbnail': 'img/acricketer.png'
					},
					function(insertedData){
						bublApp.variables['bublid'] = insertedData['id'];
						bublApp.variables['bubltitle'] = insertedData['title'];
						bublApp.setCurrentBubl(insertedData,
							function(){
								bublApp.loadPage('bublEditor', 'slideInRight', 'slideOutLeft');						
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
			},
			GridClick: function(data){
				objectStore.getObject(bublApp.variables['bublid'], 'withchildren',
					function(bubl){
						var page = 0;
						if(bubl.children){
							page = bubl.children.length;
						}
						objectStore.upsertObject(
							{
								'parentId': bublApp.variables['bublid'],
								'title': 'New page ' + page,
								'description': 'New page.',
								'thumbnail': data.params.content.imageurl
							},
							function(insertedData){
								bublApp.variables['bublpageid'] = insertedData['id'];
								
								if(page === 0){
									delete bubl['children'];
									bubl['thumbnail'] = data.params.content.imageurl;
									objectStore.upsertObject(bubl,
										function(){
											bublApp.loadPage('bublEditor');																		
										}
									);
								} else {
									delete bubl['children'];
									bublApp.loadPage('bublEditor', 'slideInRight', 'slideOutLeft');									
								}
							}
						);
					}
				);
			}
		},
		"bublPages": {
			onLoad(data, callback){
				objectStore.getObject(bublApp.variables['bubl']['id'], 'withchildren',
					function(loadedData){
						bublApp.findID('bubleGrid', data, 
							function(element){
								ZEN.ui.Grid.populate(loadedData.children, element.children);
								callback();
							}
						);
					} 
				)
			}	
		},
		"bublProperties": {
			onLoad: function(data, callback){
				callback();
			},
			
			afterLoad: function(data, callback){
				var self = this;
				objectStore.getObject(bublApp.variables['bubl']['id'], 'withdescendents',
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
						bublApp.loadPage('bublSelector', 'slideInLeft', 'slideOutRight');
					}
				);
			}
		}
	};
