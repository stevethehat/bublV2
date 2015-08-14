var bublForm = {
	showForm: function(parentView, object, definitionFileName){
		var self = this;		
		// create definition
		self.loadForm(definitionFileName,
			function(data){
				self.displayForm(parentView, object, data);
			}
		);
	},
	
	insertForm: function(parentView, object, definitionFileName, callback){
		var self = this;
		self.loadForm(definitionFileName, 
			function(data){
				var processedDefinition = self.processDefinition(object, data);
				parentView['children'] = [processedDefinition];
				bublApp.dump('insertedform', parentView);
				callback();
			}	
		);
	},
	
	loadForm: function(definitionFileName, callback){
		var self = this;		
		// create definition
		$.ajax(
			{
				'type': 'GET',
				'dataType': "json",
				'url': 'app/definitions/' + definitionFileName,
				'cache': false,
				success: function (data) {
					callback(data);
				}
			}			
		);
	},
	processDefinition: function(object, definition){
		var self = this;
		var processedDefinition = {
			'type': 'View',
			'id': 'form',
			'layout': { 'style': 'vertical' },
			'size': { 'width': 'max' },
			'children': [
				{
					"type": "Control",
					"label": "<h2>" + definition.title + "</h2>",
					'size': { 'width': 'max', 'height': 40 }	
				}
			]
		};

		_.each(definition.fields,
			function(field){
				var fieldDefinition = {
					'type': field.type,
					'label': field.label,
					'placeholder': field.placeholder,
					'size': { 'width': 'max', 'height': 40 },
					'source': field.source,
					'value': self.getValue(object, field.source) 	
				};
				processedDefinition.children.push(fieldDefinition);
			}	
		);
		return(processedDefinition)
	},
	displayForm: function(parentView, object, definition){
		var self = this;
		var form = ZEN.objects[parentView];
		var parentID = form.parent.id;
		
		var processedDefinition = self.processDefinition(object, definition);
		
		ZEN.cleanup();
		if(ZEN.objects['form'] !== undefined){
			ZEN.objects['form'].remove();
		}
		
		processedDefinition = bublApp.preParse(processedDefinition);

		ZEN.parse(processedDefinition, ZEN.objects['PropertiesForm']);		
		form.show(true);
	
		//ZEN.objects['properties'].resize(true);
		ZEN.objects[parentID].resize(true);						
	},
	getValue: function(object, source){
		try{
			var sourceBits = source.split('.');
			var result = null;
			var level = object.params;
			
			if(sourceBits[0] === 'parent'){
				sourceBits.shift();
				level = object.parent.params;
			}
			
			for(var i=0; i < sourceBits.length; i++){
				var sourceBit = sourceBits[i];
				if(i === sourceBits.length -1){
					result = level[sourceBit];
				} else {
					if(level.hasOwnProperty(sourceBit)){
						level = level[sourceBit];
					} else {
						level[sourceBit] = {}
						level = level[sourceBit];
					}
				}
			}
			ZEN.log('get value "' + source + '" = "' + result + '"');
		} catch(exception) {
			ZEN.log('get value error "' + source + '"  ("' + exception + ')');
			result = '';
		}
		return(result);
	},
	setValue: function(object, source, value){
		ZEN.log('set value "' + source + '"');
		
		var sourceBits = source.split('.');
		var params = object.params;

		if(sourceBits[0] === 'parent'){
			sourceBits.shift();
			params = object.parent.params;
		}
		
		var level = params;
		for(var i=0; i < sourceBits.length; i++){
			var sourceBit = sourceBits[i];
			if(i === sourceBits.length -1){
				level[sourceBit] = value;
			} else {
				if(level.hasOwnProperty(sourceBit)){
					level = level[sourceBit];
				} else {
					level[sourceBit] = {}
					level = level[sourceBit];
				}
			}
		}
	},
	save: function(object){
		var self = this;
		$('.formElementContainer input').each(
			function(index, element){
				element = $(element);
				var value = null;
				var source = element.attr('data-source');
				if(element.attr('type') === 'checkbox'){
					value = element.attr('checked');
				} else {
					value = element.val();
				}
				ZEN.log('found element (' + source + ') = ' + value, element);
				
				self.setValue(object, source, value);	
			}
		);
	}
}