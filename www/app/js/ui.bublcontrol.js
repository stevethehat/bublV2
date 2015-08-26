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
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
					//ZEN.events.ContentEditableHandler (this, this.el);
					ZEN.events.buttonHandler (this, this.el);
				},

				label: function () {
				},

				notify: function (message) {
					message.source = this;

					ZEN.log(message.type);
					
					if (message.type === 'highlight') {
						this.el.addClass('hover');
					} else {
						this.el.removeClass('hover');
					}
					
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
							alert('active ' + this.id);
						}
					}
				},

				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('zen-contentarea');
						var dropArea = $('<div/>').addClass('contentareadrop').appendTo(this.el);
						var instructions = $('<p>Add content here</p>').appendTo(dropArea);
						this.resize();
					}
					return this.el;
				},
				
				setupStylingDiv: function(){
					var self = this;
					self.stylingDiv = $('<div/>').appendTo(this.el);
					
					//alert('setup styling div ' + self.stylingDiv.html());
					if(self.params.styling === undefined){
						self.params.styling = {};
					}
					self.params.styling = _.extend(self.params.styling, { 'width' : '100%', 'height': '100%' })
					self.stylingDiv.css(self.params.styling);	
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
