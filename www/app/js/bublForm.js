var bublForm = {
	showForm: function(parentView, object, definitionFileName, standardElements){
		var self = this;		
		// create definition
		self.loadForm(definitionFileName,
			function(data){
				data.fields = data.fields.concat(standardElements.fields);
				self.displayForm(parentView, object, data);
			}
		);
	},
	
	insertForm: function(parentView, object, definitionFileName, callback){
		var self = this;
		self.loadForm(definitionFileName, 
			function(data){
				ZEN.log('insert form ', object);
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
			'children': []
		};

		_.each(definition.fields,
			function(field){
				if(field.type === 'combo'){
					var group = {
						'type': 'View',
						'layout': { 'style': 'horizontal' },
						'size': { 'width': 'max' },
						'children': []
					}			
					
					if(field.label !== undefined){
						processedDefinition.children.push(
							{
								'type': 'Control',
								'label': field.label,
								'size': { 'width': 'max', 'height': 24 }
							}
						);	
					}
					processedDefinition.children.push(group);
					_.each(field.fields,
						function(subField){
							self.processFieldDefinition(object, subField, group.children);		
						}
					);
				} else {
					self.processFieldDefinition(object, field, processedDefinition.children);	
				}
			}	
		);
		return(processedDefinition)
	},
	
	processFieldDefinition: function(object, field, group){
		var self = this;
		var fieldDefinition = {
			'type': field.type,
			'label': field.label,
			'placeholder': field.placeholder,
			'size': { 'width': 'max', 'height': 40 },
			'source': field.source,
			'value': self.getValue(object, field.source),
			'options': field.options 	
		};
		group.push(fieldDefinition);		
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
	
	removeForm: function(){
		var form = ZEN.objects['PropertiesForm'];
		$('#' + form.id + ' div').each(
			function(index, element){
				element = $(element);
				ZEN.log('remove form element ', element);
				var object = ZEN.objects[element.attr('id')];
				if(object !== undefined){ 
					object.remove();
				}
			}
		);	
		ZEN.cleanup();
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
		$('.formElementContainer input, .formElementContainer select').each(
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
				
				if(element.attr('data-type') === 'Number'){
					value = Number(value);
				}
				
				self.setValue(object, source, value);
			}
		);

		ZEN.cleanup();		
		ZEN.log('for save ', object);
	},
	updateObject: function(object){
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