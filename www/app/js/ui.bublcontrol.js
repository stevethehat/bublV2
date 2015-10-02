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
				
				getSetting: function(setting, defaultValue){
					var result = defaultValue;
					try{
						result = setting;
					} catch(error) {
						
					}
					return(result);
				},

				/*
				notify: function (message) {
					var self = this;
					message.source = this;

					ZEN.log(message.type);
					
					if (message.type === 'highlight') {
						this.el.addClass('hover');
					} else {
						this.el.removeClass('hover');
					}
					self.addActionEvents(message);					
				},
				*/
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
						var dropArea = $('<div/>').addClass('contentareadrop').appendTo(this.el);
						var instructions = $('<p>Add content here %s</p>' % this.type).appendTo(dropArea);
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
