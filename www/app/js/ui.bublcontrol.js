/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function BublControl (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		BublControl.prototype = new ZEN.ui.Control();
		
		_.extend(
			BublControl.prototype,
			{

				init: function (params, parent) {
					this.colourLayer = null;
					this.imageLayer = null;
					// call the base class init method
					params['view'] = { 
						'size': { 'width': params.size.width, 'height' : params.size.height }
					};
					
					if(params['position'] !== undefined){
						params['view']['position'] = params['position']; 
					}
					ZEN.ui.Control.prototype.init.call(this, params, parent);
					
					ZEN.events.buttonHandler (this, this.el);
				},

				label: function () {
				},
				
				getPropertiesField: function(id){
					var self = this;
					var result = null;
					_.each(self.propertiesDefinition.fields,
						function(field){
							if(field.id === id){
								result = field;
							}
						}
					);
					return(result);
				},
					
				afterEdit: function(element){
					var self = this;
					var elementClass = self.params.elementClassName;
					var page = bublApp.variables['page'];
					var css = {};

					if(element.params.styles){
						css = {
							'padding-top': element.params.styles['padding-top'],
							'padding-left': element.params.styles['padding-left']
						}						
					}
					
					_.each(page.css['definition'],
						function(definition){
							if(definition.class.indexOf(elementClass) === 0 && definition.class.indexOf('.label') !== -1){
								definition['styles'] = css;
							}
						}
					);
					
					self.controlAfterEdit(element);
				},
				
				controlAfterEdit: function(element){
					
				},	
				
				setupPropertiesForm: function(propertiesDefinition, callback){
					// setup fonts
					var self = this;
					self.propertiesDefinition = propertiesDefinition;	
					self.setupFontProperty();	
					self.setupStylesProperty();
					self.setupInteractions(callback);	
				},

				setupFontProperty: function(){
					var self = this;
					var font = self.getPropertiesField('font');
					var options = []
					_.each(bublApp.variables['page']['css']['definition'],
						function(styleDefinition){
							if(styleDefinition['class'].indexOf('fontstyle') == 0){
								var color = 'White';
								if(styleDefinition['styles']['font-family'] === 'rgba(255,255,255)'){
									color = 'Black';
								}
								
								var label = styleDefinition['styles']['font-family'] + ' (' + styleDefinition['styles']['font-size'] + ') ' + color; 
								options.push(
									{
										'label': label,
										'value': styleDefinition['class']
									}
								)									
							}
						}
					)
					if(font !== null){
						font['options'] = options;
					}
				},
				
				setupStylesProperty: function(){
					var self = this;
					var style = self.getPropertiesField('style');
					
					if(style !== null){
						style['options'] = [
							{ 'label': 'No Style', 'value': 'no-style' },
							{ 'label': 'MS Blue', 'value': 'ms-blue' },
							{ 'label': 'MS Red', 'value': 'ms-red' },
							{ 'label': 'MS Dark Red', 'value': 'ms-dk-red' },
							{ 'label': 'MS Orange', 'value': 'ms-orange' },
							{ 'label': 'MS Purple', 'value': 'ms-purple' },
							{ 'label': 'MS Teal', 'value': 'ms-teal' },
							{ 'label': 'MS Green', 'value': 'ms-green' },
							{ 'label': 'MS Dark Purple', 'value': 'ms-dk-purple' },
							{ 'label': 'White', 'value': 'white' }
						]										
					}
				},

				setupInteractions: function(callback){
					var self = this;
					
					ZEN.data.load('app/definitions/interactions.json', {},
						function(interactionsDefinition){
							var highlightActions = interactionsDefinition.fields[0];
							var highlightOptions = highlightActions.fields[0].options;
							var activeActions = interactionsDefinition.fields[1];
							var activeOptions = activeActions.fields[0].options;

							objectStore.getObject(bublApp.variables['bubl']['id'], 'withchildren',
								function(data){
									_.each(data.children,
										function(page){
											highlightOptions.push( { 
												'label': 'Goto - ' + page.title, 
												'value': 'showpage' + page.id 
											});		
											activeOptions.push( { 
												'label': 'Goto - ' + page.title, 
												'value': 'showpage' + page.id 
											});										
										}
									);								
									self.propertiesDefinition.fields.push(highlightActions);
									self.propertiesDefinition.fields.push(activeActions);
									callback();
								}
							);
						}
					);		
				},
								
				getPropertyValue: function(setting, defaultValue){
					var result = defaultValue;
					ZEN.log('get property value ' + setting);
					try{
						result = setting;
					} catch(error) {
						
					}
					return(result);
				},
				
				resetClass: function(){
					//this.el.attr('class', '');	
				},
				
				getSetting: function(setting, defaultValue){
					var result = defaultValue;
					ZEN.log('get setting ' + setting);
					try{
						result = setting;
					} catch(error) {
						
					}
					return(result);
				},

				notify: function (message) {
					var self = this;
					message.source = this;

					ZEN.log(message.type + ' ' + message.source.id);
					
					if (message.type === 'highlight') {
						this.el.addClass('hover');
					} else {
						this.el.removeClass('hover');
					}
					self.addActionEvents(message);					
				},

				addActionEvents: function(message){
					if(bublApp.displayMode === 'app'){
						if(message.type === 'active') {
							ZEN.notify ("ui.bublcontrol", message);
						
							if(bublApp.variables['contentelement'] !== undefined){						
								bublApp.variables['contentelement'].el.removeClass('selected');
							}						
						
							this.el.addClass('selected');
							bublApp.variables['contentelement'] = this;
						}
					} else {
						if(this.params.actions !== undefined && this.params.actions.highlightAnimation !== undefined){
							if (message.type === 'highlight') {
								this.el.addClass(this.params.actions.highlightAnimation + ' animated');
							} else {
								this.el.removeClass(this.params.actions.highlightAnimation + ' animated');
							}
						}
						if(message.type === 'active'){
							if(this.params.actions.activeAction.startsWith('showpage')){
								var pageID = this.params.actions.activeAction.substr(8);
								bublApp.loadPlayerPage(pageID, this.params.actions.activeAnimation);
							}
							return(false);
						}
					}
				},

				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('zen-contentarea');
						this.setupStylingDiv();
						if(bublApp.displayMode === 'app'){
							this.el.css('cursor', 'pointer');
						} else {
							ZEN.log('in here');
							if(this.params.actions !== undefined){
								if(this.params.actions.activeAction !== undefined && this.params.actions.activeAction !== 'undefined'){
									this.el.css('cursor', 'pointer');
								}
							}
						}
						this.resize();
					}
					return this.el;
				},
				
				setupStylingDiv: function(){
					var self = this;
					
					this.imageLayer = $('<div class="bg-image" />');
					this.imageLayer.prependTo(this.el);						 
					this.colourLayer = $('<div class="bg-colour" />');
					this.colourLayer.prependTo(this.el);
					
					self.stylingDiv = $('<div/>').appendTo(this.imageLayer);
					
					if(self.params.styling === undefined){
						self.params.styling = {};
					}
					self.params.styling = _.extend(self.params.styling, { 'width' : '100%', 'height': '100%' }, self.params.css);
				},
				
				opacity: function (value) {
					if (value !== undefined) {
						this._opacity = value;
						//if(this.colourLayer !== null && this.colourLayer !== undefined){
						if(true){
							this.colourLayer.css('opacity',this._opacity);
						} else {
							alert('no color layer for ' + this.type)
						}
						return this;
					} else {
						return this._opacity;
					}
				},

				image: function (value) {
					if (value !== undefined) {
						this._image = value;
						//if(this.imageLayer !== null && this.imageLayer !== undefined){
						if(true){
							this.imageLayer.css({
								'background-image':'url('+this._image+')'
							});
						} else {
							alert('no image layer for ' + this.type)
						}
						return this;
					} else {
						return this._image;
					}
				},
								
				setupControlPropertiesForm: function(form, callback){
					callback();
					//alert('setup properties form ' + this.type + ' ' + JSON.stringify(form, null, 4));
				}
				
				
			}
		);

		ZEN.registerType('BublControl',BublControl);

		return {
			BublControl: BublControl
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
