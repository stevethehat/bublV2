/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function FloatMenu (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		FloatMenu.prototype = new ZEN.ui.Control();
		
		FloatMenu.getMenuPositionAndSize = function(root, contentElement){
			var self = this;
			var menuItems = contentElement.menuItems();
			var page = ZEN.objects['BublPageRoot'];
			var pageWidth = Number(page.params.size.width);
			var pageHeight = Number(page.params.size.height);
			
			var element = contentElement;
			var top = 0;
			var left = 0;
			var menuSize = {};
			var menuPosition = {};

			while(element.parent.id !== root.id){
				if(_.isNumber(element.parent.position.top)){
					top += Number(element.parent.position.top);			
				}
				if(_.isNumber(element.parent.position.left)){
					left += Number(element.parent.position.left);			
				}
				element = element.parent;
			}
			if(contentElement.el.width() > contentElement.el.height()){
				menuSize = { "width": (Number(menuItems.length) -1) * 43, "height": 33 };
			} else {
				menuSize = { "width": 33, "height": (Number(menuItems.length) -1) * 43 };
			}
		
			menuPosition.top = top;
			menuPosition.left = left + 80;
			/*
			if(top < pageHeight / 2){
				menuPosition.top = top + contentElement.params.size.height + 2;
			} else {
				menuPosition.top = top + -38;
			}
			if(left < pageWidth / 2){
				menuPosition.left = left + 80; 
			} else {
				menuPosition.left = left + 80; 
			}
			*/
			var result = {
				'size': menuSize,
				'position': menuPosition
			}
			return(result);
		}

		_.extend(
			FloatMenu.prototype,
			{

				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
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
						self.showProperties(message.sourceElement);
						ZEN.notify ("ui.FloatMenu", message.sourceElement.id);
					}
				},
				
				showProperties: function(sourceElement){
					var self = this;
					var page = ZEN.objects['BublPageRoot'];
					var propertiesPositioning = ZEN.ui.FloatProperties.position(this, this.contentElement, sourceElement);
					var propertiesDefinition = {
						'id': 'propertiesView',
						'type': 'View',
						'show': true,
						'size': propertiesPositioning.size,
						'position': propertiesPositioning.position,
						'layout': { 'style': 'vertical' },
						'children': [
							{
								'type': 'FloatProperties',
								'id': 'properties',								
								'params': {
									'arrowposition': propertiesPositioning.arrowpos
								}
							}
						]
					}	
					var properties = ZEN.parse(propertiesDefinition, page);
					properties.show(true);
					page.resize(true);													
				},
				
				getElement: function () {
					var self = this;
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						// this.el.attr('tabindex',0);
						var menu = $('<div/>').appendTo(this.el);
						this.el.addClass('zen-FloatMenu');
												
						_.each(this.params.menu,
							function(menuItem){
								var menuItemDiv = $('<div/>').addClass('menuItem').appendTo(menu);
								menuItemDiv.attr('title', menuItem.label);
								menuItemDiv.attr('id', self.id + '.' + menuItem.id);
							}
						);
						self.showProperties(null)
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('FloatMenu', FloatMenu);

		return {
			FloatMenu: FloatMenu
		};
	}()));
	return ZEN;
}(ZEN || {}, _, $));
