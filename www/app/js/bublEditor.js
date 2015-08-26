var bublEditor = {
	setupObservers: function(){
		var self = this;
		bublApp.setupObserver('ui.contenteditable',
			function(message){
				ZEN.log('observer(ui.contenteditable)', message, $(message.sourceElement));	
				alert('show editor contenteditable');
				//self.executeAction(message.source.tag, message);	
			}
		);
		
		bublApp.setupObserver('ui.bublcontrol',
			function(message){
				ZEN.log('observer(ui.bublcontrol)', message, $(message.sourceElement));
				ZEN.log('show editor', message.source);
				bublApp.setCurrentObject(['contentelement'], message.source,
					function(){
						//ZEN.objects['BublElementEditor'].setContent(JSON.stringify(message.source.params, null, 4));
						ZEN.data.load('app/definitions/style.json', {},
							function (standard) {
								bublForm.showForm('PropertiesForm', message.source, message.source.params.type + '.json', standard);
							}
						);
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
		
		ZEN.log('add control', bublApp.variables);
		
		/*
		"position": { "bottom": 10, "right": 10 },
		"size": { "width": 40, "height": 40 },
		*/
		
		var parentID = contentArea.parent.id;
		contentArea.remove(true);
		ZEN.cleanup();
		//var parentID = contentArea.id;
		
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
	setupChildViews: function(content, children, orientation){
		var self = this;
		
		/*
		if(content.children === undefined){
			content.children = [];
		}
		if(content.children.length === 0){
			var view = {
				'type': 'View', 
				'children': [], 
				'layout': {},
				'size': { 'width': 'max', 'height': 'max' },
				'defaults': {
					'size': { 'width': 'max', 'height': 'max' },
					'layout': { 'style': 'vertical', 'align': 'left' } 					
				}
			}
			content.children.push(view);	
		}
		*/
		
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