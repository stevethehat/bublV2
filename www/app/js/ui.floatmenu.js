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
		
		FloatMenu.getMenuPositionAndSize = function(contentElement, contentElementProperties){
			var self = this;
			var root = ZEN.objects['bublEditor'];
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
				menuSize = { "width": (Number(contentElementProperties.propertypages.length) -1) * 43, "height": 33 };
			} else {
				menuSize = { "width": 33, "height": (Number(contentElementProperties.propertypages.length) -1) * 43 };
			}
		
			menuPosition.top = top;
			menuPosition.left = left + 80;
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
						self.showProperties(message.sourceElement.id);
						ZEN.notify ("ui.FloatMenu", message.sourceElement.id);
					}
				},

				propertiesPosition: function(menuButton, currentPage){
					var self = this;
					var page = ZEN.objects['BublPageRoot'];
					var app = ZEN.objects['BublApp'];
		
					var menuButtonPosition = 0;
					var index = 0;
					_.each(self.menuItems,
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
						'height': self.propertiesForm.height + 100
					};
					var propertiesPosition = {};
		
					var arrowPos = '';	
					if(self.parent.position.top < (pageHeight / 2)){
						propertiesPosition.top = self.parent.position.top + 50;
						arrowPos = 'top';
					} else {
						propertiesPosition.top = self.parent.position.top - propertiesSize.height -16;
						arrowPos = 'bottom';
					}

					propertiesPosition.left = self.parent.position.left - 80;
				
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
				},
				
				getCurrentPage: function(menuButton){
					var self = this;
					var menuButtonPosition = 0;
					var index = 0;
					_.each(self.menuItems,
						function(menuItem){
							if(menuItem == menuButton){
								menuButtonPosition = index;
							}
							index++;
						}
					);
					return(menuButtonPosition);
				},

				positionArrow: function(position){
					var self = this;
				},
				
				showProperties: function(sourceElement){
					var self = this;
					var page = ZEN.objects['BublPageRoot'];
					var currentPage = self.getCurrentPage(sourceElement);
					bublApp.variables['contentelement'].getPropertiesForm(currentPage,
						function(propertiesForm){
							self.propertiesForm = propertiesForm; 
							var propertiesPositioning = self.propertiesPosition(sourceElement, currentPage);
							var propertiesDefinition = {
								'id': 'propertiesView',
								'type': 'View',
								'show': true,
								'size': propertiesPositioning.size,
								'position': propertiesPositioning.position,
								'layout': { 'style': 'vertical' },						
								'children': [ 
									{
										'id': 'propertiesHeading',
										'type': 'View',
										'size': { 'width': 'max', 'height': 60 },
										'children':[
											{
												'type': 'Button',
												'size': { 'width': 'max', 'height': '50' },
												'label': self.propertiesForm.label 										
											}									
										]
									},
									{
										'type': 'View',
										'size': { 'width': 'max', 'height': 'max' }, 
										'children':[
											self.propertiesForm
										]
									},
									{
										'id': 'propertiesButtons',
										'type': 'View',
										'size': { 'width': 'max', 'height': 60 },
										'children': [
											{
												'type': 'Button',
												'label': 'Save changes',
												'id': 'form-save',
												'view': {'size': {'width': 'max', 'height': 52}},
												'actions': {
														'active': {'queue': 'ui.form', 'message': {'type': 'submit'}}
												}
											}									
										]
									}
								]
							}	
							if(ZEN.objects['propertiesView'] !== undefined){
								ZEN.objects['propertiesView'].remove(true);
							}
							
							var properties = ZEN.parse(propertiesDefinition, page);
							properties.show(true);
							self.positionArrow(currentPage);					
							page.resize(true);
							/*
							ZEN.observe('ui.form', null, {},
								function(message){
									if(message.type === 'submit'){
										ZEN.objects['propertiesView'].remove(true);
										ZEN.objects[self.id].remove(true);
										
										alert(JSON.stringify(message, null, 2));	
																	
									}
								}
							)
							*/	
							ZEN.app = {
								sendForm: function(message, data){
									var contentElement = bublApp.variables['contentelement'];
									if(contentElement.parent.autoAddedView === true){
										var removeElement = contentElement.parent;
										var parentID = contentElement.parent.parent.id;
									} else {
										var removeElement = contentElement;										
										var parentID = contentElement.parent.id;
									}
									
									contentElement.update(data);
									properties.remove(true);
									self.remove(true);
									
									var content = contentElement.safeSerialize()['params'];
				
									removeElement.remove(true);
									ZEN.cleanup();
		
									//content = self.fixContent(content);

									var newElement = ZEN.parse(content, ZEN.objects[parentID]);
									ZEN.objects[parentID].show(true);
									ZEN.objects['bublEditor'].resize(true);
									bublApp.variables['contentelement'] = newElement;	
								}
							}							
						}
					);												
				},
				
				getElement: function () {
					var self = this;
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						// this.el.attr('tabindex',0);
						var menu = $('<div/>').appendTo(this.el);
						this.el.addClass('zen-FloatMenu');
						
						self.menuItems = [];
												
						_.each(this.params.definition.propertypages,
							function(menuItem){
								var menuItemDiv = $('<div/>').addClass('menuItem').appendTo(menu);
								menuItemDiv.attr('title', menuItem.label);
								menuItemDiv.attr('id', self.id + '.' + menuItem.id);
								self.menuItems.push(menuItemDiv.attr('id'));
							}
						);
						self.showProperties(self.menuItems[0]);
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
