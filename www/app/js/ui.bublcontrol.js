/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function BublControl (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.LayoutControl.call(this, params, parent);
			}
			return this;
		}

		BublControl.prototype = new ZEN.ui.LayoutControl();
		
		_.extend(
			BublControl.prototype,
			{

				init: function (params, parent) {
					this.colourLayer = null;
					this.imageLayer = null;
					// call the base class init method
					ZEN.ui.LayoutControl.prototype.init.call(this, params, parent);
					//ZEN.events.ContentEditableHandler (this, this.el);
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
				
				setupPropertiesForm: function(propertiesDefinition, callback){
					// setup fonts
					var self = this;
					self.propertiesDefinition = propertiesDefinition;	
					self.setupFontProperty();	
					self.setupStylesProperty();	
					
					callback();
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
					//alert(JSON.stringify(font));
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

					//ZEN.log(message.type + ' ' + message.source.id);
					
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
						if(this.params.actions !== undefined && this.params.actions.hoveranimate !== undefined){
							if (message.type === 'highlight') {
								this.el.addClass(this.params.actions.hoveranimate + ' animated');
							} else {
								this.el.removeClass(this.params.actions.hoveranimate + ' animated');
							}
						}
						if(message.type === 'active'){
							if(this.params.actions.active.startsWith('showpage')){
								var pageID = this.params.actions.active.substr(8);
								bublApp.loadPlayerPage(pageID, this.params.actions.activeanimation);
								//alert('show page ' + pageID);								
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
						//var dropArea = $('<div/>').addClass('contentareadrop').appendTo(this.el);
						//var instructions = $('<p>Add content here %s</p>' % this.type).appendTo(dropArea);
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
					
					//alert('setup styling div ' + self.stylingDiv.html());
					if(self.params.styling === undefined){
						self.params.styling = {};
					}
					self.params.styling = _.extend(self.params.styling, { 'width' : '100%', 'height': '100%' }, self.params.css);
					//self.stylingDiv.css(self.params.styling);
					//alert(JSON.stringify(self.params.styling));	
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
