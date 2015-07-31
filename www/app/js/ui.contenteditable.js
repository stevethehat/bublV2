/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function ContentEditable (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		ContentEditable.prototype = new ZEN.ui.Control();
		
		_.extend(
			ContentEditable.prototype,
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
						//this.el.attr('contenteditable', 'true');
						/*
						var backgroundColor = this.el.css('background-color');
						var color = this.el.css('color');
						this.el.css(
							{
								'color': backgroundColor,
								'background-color': color
							}
						);
						*/
						ZEN.notify ("ui.bublcontrol", message);
					}
				},

				
				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						// this.el.attr('tabindex',0);
						this.el.addClass('zen-contenteditable');
						this.el.html(this.params.label);
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('ContentEditable',ContentEditable);

		return {
			ContentEditable: ContentEditable
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
