/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function ContentArea (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.BublControl.call(this, params, parent);
			}
			return this;
		}

		ContentArea.prototype = new ZEN.ui.BublControl();
		
		_.extend(
			ContentArea.prototype,
			{

				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.BublControl.prototype.init.call(this, params, parent);
					//ZEN.events.ContentEditableHandler (this, this.el);
					ZEN.events.buttonHandler (this, this.el);
				},

				label: function () {
				},

				notify: function (message) {
					var self = this;
					message.source = this;

					ZEN.log(message.type);
					
					if (message.type === 'highlight') {
						this.el.addClass('hover');
					} else {
						this.el.removeClass('hover');
					}

					if(message.type === 'active') {
						ZEN.notify ("ui.bublcontentarea", message);
						//alert('here');
						
						if(bublApp.variables['contentelement'] !== undefined){						
							bublApp.variables['contentelement'].el.removeClass('selected');
						}						
						
						this.el.addClass('selected');
						bublApp.variables['contentelement'] = this;
						ZEN.notify('ui.bublcontrol', message);
					}
					self.addActionEvents(message);					
				},

				
				getElement: function () {
					var self = this;
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('zen-contentarea');
						self.setupStylingDiv();

						var dropArea = $('<div/>').appendTo(self.stylingDiv);
						if(bublApp.displayMode === 'app'){
							dropArea.addClass('contentareadrop');
							var instructions = $('<p>Add content here</p>').appendTo(dropArea);
						}
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('ContentArea',ContentArea);

		return {
			ContentArea: ContentArea
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
