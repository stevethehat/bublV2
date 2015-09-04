var bublEditor = {
	load: function(data, callback){
		var pageDefinition = data;
		bublUtil.findID('bublEditor', pageDefinition, 
			function(element){
				var layout = bublApp.variables['page'].layout;
				element.children = [layout];
			
				objectStore.getObject('3000', 'withchildren',
					function(data){
						//var assetList = ZEN.objects['AssetList'];
						bublUtil.findID('AssetList', pageDefinition,
							function(assetList){
								_.each(data.children,
									function(asset){
										assetList['controls'].push(
											{
												'type': 'Asset',
												'label': '',
												'image': 'app/' + asset.thumbnail,
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
			}
		);
	},
	setupObservers: function(){
		var self = this;
		bublApp.setupObserver('ui.contenteditable',
			function(message){
				ZEN.log('observer(ui.contenteditable)', message, $(message.sourceElement));	
				alert('show editor contenteditable');
				//self.executeAction(message.source.tag, message);	
			}
		);

		bublApp.setupObserver('ui.asset',
			function(message){
				bublEditor.addControl(
					{ 
						'params': {
							'content': {
								'addtype': 'BublImage',
								'url': message.source.params.image
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
						//ZEN.objects['BublElementEditor'].setContent(JSON.stringify(message.source.params, null, 4));
						ZEN.data.load('app/definitions/style.json', {},
							function (standard) {
								self.setupPropertiesForm(standard,
									function(standard){
										bublForm.showForm('PropertiesForm', message.source, message.source.params.type + '.json', standard);
									}
								);
							}
						);
					}
				);
			}
		);		
	},
	setupPropertiesForm: function(form, callback){
		// add actions 
		var clickActions = {
			'type': 'FormSelect',
			'label': 'Click Action',
			'options': [],
			'source': 'actions.active'
		}
				
		objectStore.getObject(bublApp.variables['bubl']['id'], 'withchildren',
			function(data){
				clickActions.options.push( { 'label': 'No action', 'value': '' });		

				_.each(data.children,
					function(page){
						clickActions.options.push( { 'label': 'Goto - ' + page.title, 'value': 'showpage' + page.id });		
					}
				);
				form.fields[form.fields.length -1].fields.push(clickActions);
				var clickTransitions = {
					'type': 'FormDataList',
					'label': 'Transition',
					'source': 'actions.activeanimation',
					'options': [
						{ "value": "bounceInDown" },	
						{ "value": "bounceInUp" },	
						{ "value": "bounceInLeft" },	
						{ "value": "bounceInRight" },	
						{ "value": "slideInDown" },	
						{ "value": "slideInUp" },	
						{ "value": "slideInLeft" },	
						{ "value": "slideInRight" },	
						{ "value": "fadeIn" },	
						{ "value": "flipInX" },	
						{ "value": "flipInY" }	
					]
				}
				form.fields[form.fields.length -1].fields.push(clickTransitions);
				
				bublUtil.findID('colors', form, 
					function(colors){
						var parent = bublApp.variables['contentelementparent'];
						colors.fields[0].default = parent.params.styling['color'];
						colors.fields[1].default = parent.params.styling['background-color'];
						
						callback(form);
					}
				);				
			}	
		);
	},
	addControl: function(data){
		var contentArea = bublApp.variables['contentelement'];
		var positioning = 'fill'; 
		if(contentArea.params.childtype !== undefined){
			positioning = contentArea.params.childtype;
		}
		
		var newControlParams = {
			'type': data.params.content.addtype,
			'css': contentArea.params.css,
			'margin': contentArea.params.margin
		}
		
		delete data.params.content['addtype'];
		newControlParams['content'] = data.params.content;
		
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
		//var content = JSON.parse(ZEN.objects['BublElementEditor'].getContent());
		var parentID = element.parent.id;
		
		bublForm.save(element);
		bublForm.removeForm();
		content = element.params;
						
		element.remove(true);
		ZEN.cleanup();
		
		content = self.fixContent(content);

		var parsedData = bublApp.preParse(content);
		var newElement = ZEN.parse(parsedData, ZEN.objects[parentID]);
		ZEN.objects[parentID].show(true);
		ZEN.objects['bublEditor'].resize(true);
		bublApp.variables['contentelement'] = newElement;										
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