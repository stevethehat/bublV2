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
			'children': []
		};
		/*
		{
			'type': 'FormEdit',
			'size': { 'width': 'max', 'height': 40 }	
		},
		*/
		
		_.each(definition.fields,
			function(field){
				var fieldDefinition = {
					'type': field.type,
					'size': { 'width': 'max', 'height': 40 }	
				};
				processedDefinition.children.push(fieldDefinition);
			}	
		);

		alert(JSON.stringify(processedDefinition, null, 4));
		ZEN.cleanup();
		if(ZEN.objects['form'] !== undefined){
			ZEN.objects['form'].remove();
		}
		
		processedDefinition = bublApp.preParse(processedDefinition);
		//alert(JSON.stringify(definition, null, 4));

		ZEN.parse(processedDefinition, ZEN.objects['PropertiesForm']);		
		form.show(true);
	
		ZEN.objects['properties'].resize(true);				
	}
}