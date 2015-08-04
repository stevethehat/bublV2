/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function ContentArea (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		ContentArea.prototype = new ZEN.ui.Control();
		
		_.extend(
			ContentArea.prototype,
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

					if(message.type === 'active') {
						ZEN.notify ("ui.bublcontentarea", message);
						
						if(bublApp.variables['selectedcontentarea'] !== undefined){						
							bublApp.variables['selectedcontentarea'].el.removeClass('selected');
						}						
						
						this.el.addClass('selected');
						bublApp.variables['selectedcontentarea'] = this;
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
