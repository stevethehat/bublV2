/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {
		function FloatProperties (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		FloatProperties.prototype = new ZEN.ui.Control();
		
		FloatProperties.position = function(floatMenu, contentElement, menuButton){
			var self = this;
			var page = ZEN.objects['BublPageRoot'];
			var app = ZEN.objects['BublApp'];

			var menuButtonPosition = 0;
			var index = 0;
			_.each(floatMenu.menuItems,
				function(menuItem){
					if(menuItem == menuButton){
						menuButtonPosition = index;
					}
					index++;
				}
			);			
			var pageHeight = Number(page.params.size.height);
			
			var top = 0;
			var left = 0;
			var propertiesSize = {
				'width': '300',
				'height': '300'
			};
			var propertiesPosition = {};

			var arrowPos = '';
			if(floatMenu.parent.position.top < (pageHeight / 2)){
				propertiesPosition.top = floatMenu.parent.position.top + 34;
				arrowPos = 'top';
			} else {
				propertiesPosition.top = floatMenu.parent.position.top - propertiesSize.height;
				arrowPos = 'bottom';
			}

			propertiesPosition.left = floatMenu.parent.position.left - 80;
		
			var appWidth = app.el.width();
			var propertiesRight = Number(propertiesPosition.left) + Number(propertiesSize.width);
			var arrowOffset = 0; 
			if(propertiesRight > appWidth){
				arrowOffset = propertiesPosition.left - (appWidth - propertiesSize.width); 
				propertiesPosition.left = appWidth - propertiesSize.width;
			}
			var result = {
				'size': propertiesSize,
				'position': propertiesPosition,
				'arrowpos': {
					'topOrBottom': arrowPos,
					'menuItem': menuButtonPosition,
					'arrowOffset': arrowOffset 
				} 
			}
			return(result);
		}
		
		_.extend(
			FloatProperties.prototype,
			{
				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
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
						ZEN.notify ("ui.FloatProperties", message.sourceElement.id);
					}
				},
				
				getElement: function () {
					var self = this;
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('zen-FloatProperties');

						var propertiesBackground = $('<div class="background"/>').appendTo(this.el);

						var properties = $('<div class="properties"/>')
							.addClass(this.params.params.arrowposition.topOrBottom)
							.appendTo(this.el);

						$('.arrow-up').remove();
						$('.arrow-down').remove();
						var arrow = $('<div/>')
							.css('left', this.params.params.arrowposition.menuItem * 32 + this.params.params.arrowposition.arrowOffset)
							.appendTo(this.el);
							
						if(this.params.params.arrowposition.topOrBottom === 'top'){
							arrow.addClass('arrow-up');
						} else {
							arrow.addClass('arrow-down');							
						}

						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('FloatProperties', FloatProperties);

		return {
			FloatProperties: FloatProperties
		};
	}()));
	return ZEN;
}(ZEN || {}, _, $));
