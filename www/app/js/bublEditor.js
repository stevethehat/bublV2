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
	}
}