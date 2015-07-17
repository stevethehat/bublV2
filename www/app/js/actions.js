function childrenToGrid(children, gridChildren){
	_.each(children,
		function(child){
			gridChildren.push(
				{ 
					'id': 'bubl' + child.id,
			 	 	'content': { 'imageurl': child.thumbnail, 'heading': child.title, 'description': child.description } 
				}				
			);
		}
	);
}

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
			}			
		},
		'home': {
			
		},
		"bublselector":{
			onLoad: function(data, callback){
				objectStore.getObject('1000', 'withchildren',
					function(loadedData){
						bublApp.findID('bubleGrid', data, 
							function(element){
								childrenToGrid(loadedData.children, element.children);	
								callback();
							}
						);
					} 
				)
			},
			
			Select: function(data){
				var selectorBack = $('#' + data.id + ' .back');
				bublApp.variables['bublBackgroundColor'] = selectorBack.css('background-color');
				bublApp.variables['bublColor'] = selectorBack.css('color');

				var bublID = getBublID(data.id);
				bublApp.setCurrentBubl(bublID,
					function(){
						bublApp.loadPage('bubleditor');		
					}	
				);
			},
			
			Add: function(data){
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
								bublApp.loadPage('bubltemplateselector');						
							}
						);
					}
				);
				//bublApp.loadPage('bublshare');
			},
			
			Share: function(data){
				bublApp.loadPage('bublshare');
			},
			
			Duplicate: function(data){
				alert('duplicate');
			},
			
			Delete: function(data){
				var bublID = getBublID(data.id);
				objectStore.deleteObject( { 'id': bublID },
					function(){
						bublApp.loadPage('bublselector');
					}
				);
			},
			
			More: function(data){
				var bublID = getBublID(data.id);
				bublApp.setCurrentBubl(bublID,
					function(){
						bublApp.loadPage('bublproperties');		
					}	
				);
			}
		},
		"bubleditor":{
			ToolbarClick: function(data){
				switch(data.id){
					case 'back':
						bublApp.loadPage(bublApp.variables['lastpage']);
						break;
					case 'pages':
						bublApp.loadPage('bublpages');
						break;
				}
			}
		},
		"bubltemplateselector": {
			onLoad: function(data, callback){
				objectStore.getObject('2000', 'withchildren',
					function(loadedData){
						bublApp.findID('bubleGrid', data, 
							function(element){
								childrenToGrid(loadedData.children, element.children);
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
											bublApp.loadPage('bubleditor');																		
										}
									);
								} else {
									delete bubl['children'];
									bublApp.loadPage('bubleditor');									
								}
							}
						);
					}
				);
			}
		},
		"bublpages": {
			onLoad(data, callback){
				objectStore.getObject(bublApp.variables['bubl']['id'], 'withchildren',
					function(loadedData){
						bublApp.findID('bubleGrid', data, 
							function(element){
								childrenToGrid(loadedData.children, element.children);	
								callback();
							}
						);
					} 
				)
			}	
		},
		"bublproperties": {
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
						ZEN.objects['BublEditor'].setContent(JSON.stringify(object, null, 4));
						callback();
					}	
				);
			},
			
			ToolbarClick: function(data){
				switch(data.id){
					case 'back':
						bublApp.loadPage(bublApp.variables['lastpage']);
						break;
					case 'save':
						objectStore.upsertObject(JSON.parse(ZEN.objects['BublEditor'].getContent()),
							function(){
								bublApp.loadPage('bublselector');
							}
						); 
						break;
				}
			}
		}
	};
