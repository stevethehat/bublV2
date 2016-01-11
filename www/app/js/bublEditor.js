var bublEditor = {
	load: function(data, callback){
		var pageDefinition = data;
		bublUtil.findID('bublEditor', pageDefinition, 
			function(element){
				var layout = bublApp.variables['page'].layout;
				element.children = [layout];
	
				/*
				objectStore.getObject('3000', 'withchildren',
					function(data){
						bublUtil.findID('AssetList', pageDefinition,
							function(assetList){
								_.each(data.children,
									function(asset){
										assetList['controls'].push(
											{
												'type': 'Asset',
												'label': '',
												'image': 'app/' + asset.thumbnails['200x100'],
												'size': { 'height': 50, 'width': 200 },
												'margin': { 'bottom': 10 }
											}
										);										
									}
								);
								callback();								
							}
						);
					}
				);
				*/
				callback();
			}
		);
	},
	setupObservers: function(){
		var self = this;
		bublApp.setupObserver('ui.contenteditable',
			function(message){
				ZEN.log('observer(ui.contenteditable)', message, $(message.sourceElement));	
				alert('show editor contenteditable');
			}
		);

		bublApp.setupObserver('ui.asset',
			function(message){
				bublEditor.addControl(
					{ 
						'params': {
							'addcontent':{
								'type': 'BublImage',
								'content': {
									'url': message.source.params.image																	
								}
							}
						}
					}
				);
			}
		);		
				
		bublApp.setupObserver('ui.bublcontrol',
			function(message){
				ZEN.log('observer(ui.bublcontrol)', message, $(message.sourceElement));
				bublApp.variables['contentelementparent'] = bublApp.variables['contentelement'];
				bublApp.setCurrentObject(['contentelement'], message.source,
					function(){
						self.showMenuForCurrentElement();
					}
				);
			}
		);		
	},
		
	showMenuForCurrentElement: function(){
		var self = this;
		var contentElement = bublApp.variables['contentelement'];
		var currentMenuView = ZEN.objects['floatMenuView'];
		if(currentMenuView !== undefined){
			currentMenuView.remove(true);
		}
		var mainPanel = ZEN.objects['mainPanel'];
		var currentMenu = ZEN.objects['floatMenuView'];
		var currentProperties = ZEN.objects['propertiesView'];
		if(currentMenu !== undefined){
			currentMenu.remove(true);
		}
		if(currentProperties !== undefined){
			currentProperties.remove(true);
		}
		contentElement.getProperties(
			function(properties){
				var menuPositioning = ZEN.ui.FloatMenu.getMenuPositionAndSize(contentElement, properties);
				var menuDefinition = {
					"id": "floatMenuView",
					"type": "View",
					"show": true,
					"size": menuPositioning.size,
					"opacity": 0.5,
					"params": {},
					"position": menuPositioning.position,
					"layout": { "style": "vertical" },
					"children": [
						{
							"type": "FloatMenu",
							"id": "floatMenu",
							"show": true,
							"side": menuPositioning.side,
							"valign": menuPositioning.valign,
							'definition': properties,
							"size": {
								"width": "max", "height": "max"
							}
						}
					]
				}
					
				var menu = ZEN.parse(menuDefinition, mainPanel);
				menu.show(true);
				menu.contentElement = contentElement;
				mainPanel.resize(true);					
			}
		)
	},
	
	showPropertiesForCurrentElement: function(){
		var self = this;
		var currentElement = bublApp.variables['contentelement'];
		bublForm.displayForm('PropertiesForm', currentElement, currentElement.propertiesDefinition);				
		/*		
		ZEN.data.load('app/definitions/style.json', {},
			function (standard) {
				currentElemenet.setupPropertiesForm(data,
					function(){
						
						bublForm.displayForm(parentView, object, data);				
					}
				)
				
				
				bublForm.showForm('PropertiesForm', currentElement, currentElement.params.type + '.json', standard);
			}
		);
		*/		
	},

	addControl: function(data){
		var contentArea = bublApp.variables['contentelement'];
		var positioning = 'fill'; 
		if(contentArea.params.childtype !== undefined){
			positioning = contentArea.params.childtype;
		}
		
		var newControlParams = _.clone(data.params.addcontent);
		
		alert(JSON.stringify(newControlParams, null, 4));
				
		ZEN.log('add control', bublApp.variables);
		
		var parentID = contentArea.parent.id;
		contentArea.remove(true);
		ZEN.cleanup();
		
		var newControl = ZEN.parse(newControlParams, ZEN.objects[parentID]);
		ZEN.objects[parentID].show(true);
		ZEN.objects['bublEditor'].resize(true);		
		
		ZEN.notify ("ui.bublcontrol", { 'source': newControl });				
	},
	saveControl: function(data){
		var self = this;
		var element = bublApp.variables['contentelement'];
		var parentID = element.parent.id;
		
		if(element instanceof ZEN.ui.Control){
			// will get auto parent so remove this as  well
			parentID = element.parent.parent.id;
		}
		
		bublForm.save(element);
		bublForm.removeForm();
		element.afterEdit(element);
		var content = element.safeSerialize()['params'];
				
		element.remove(true);
		ZEN.cleanup();
		
		content = self.fixContent(content);

		var newElement = ZEN.parse(content, ZEN.objects[parentID]);
		ZEN.objects[parentID].show(true);
		ZEN.objects['bublEditor'].resize(true);
		bublApp.variables['contentelement'] = newElement;	
		
		var cssObj = ZEN.objects["BublCSS"];
		cssObj.applyCss();									
	},
	deleteControl: function(data){
		var currentElement = bublApp.variables['contentelement'];
		var parent = ZEN.objects[currentElement.parent.id];
		currentElement.remove(true);
		ZEN.cleanup();
		ZEN.parse(
			{
				'type': 'ContentArea',
				'size': { 'width': 'max', 'height': 'max' }
			}	
		,parent)
		parent.show(true);
		ZEN.objects['bublEditor'].resize(true);
	},
	setupChildViews: function(content, children, orientation){
		var self = this;
				
		content = {
			'type': 'View', 
			'children': [], 
			'layout': { 'style': orientation },
			'size': { 'width': 'max', 'height': 'max' },
			'defaults': {
				'size': { 'width': 'max', 'height': 'max' },
				'layout': { 'style': 'vertical', 'align': 'left' } 					
			}
		}

		if(content.children.length !== children){
			for(var i=0; i < children; i++){
				content.children.push( { 'type': 'ContentArea' } );
			}
		}
		return(content);
	},
	fixContent: function(content){
		var self = this;
		// check rows & columns
		switch(content.type){
			case 'BublColumns':
				content = self.setupChildViews(content, content.layout.columns, 'horizontal');
				break;
			case 'BublRows':
				content = self.setupChildViews(content, content.layout.rows, 'vertical');
				break;
			default:
				break;
		}
		return(content);
	}
}