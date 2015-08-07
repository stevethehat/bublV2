var bublForm = {
	showForm: function(parentView, definitionFileName){
		var self = this;		
		// create definition
		$.ajax(
			{
				'type': 'GET',
				'dataType': "json",
				'url': 'app/definitions/' + definitionFileName,
				'cache': false,
				success: function (data) {
					self.displayForm(parentView, data);
				}
			}			
		);
	},
	displayForm: function(parentView, definition){
		var form = ZEN.objects[parentView]; 		
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
					'source': field.source	
				};
				processedDefinition.children.push(fieldDefinition);
			}	
		);
		
		//alert(JSON.stringify(processedDefinition, null, 4));

		ZEN.cleanup();
		if(ZEN.objects['form'] !== undefined){
			ZEN.objects['form'].remove();
		}
		
		processedDefinition = bublApp.preParse(processedDefinition);

		ZEN.parse(processedDefinition, ZEN.objects['PropertiesForm']);		
		form.show(true);
	
		ZEN.objects['properties'].resize(true);				
	},
	getValue: function(source){
		var sourceBits = source.split;
		for(var i=0; i < sourceBits.length; i++){
			
		}
		ZEN.log('get value "' + source + '"');
	},
	setValue: function(params, source, value){
		ZEN.log('set value "' + source + '"');
		
		var sourceBits = source.split('.');
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
				ZEN.log('found element (' + element.attr('data-source') + ') = ' + element.val(), element);
				self.setValue(object.params, element.attr('data-source'), element.val());	
			}
		);
	}
}