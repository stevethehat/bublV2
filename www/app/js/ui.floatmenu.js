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
			var propertiesWidth = 316;
			var root = ZEN.objects['bublEditor'];
			var page = ZEN.objects['BublPageRoot'];

			var pageWidth = Number(root.el.width());
			var pageHeight = Number(root.el.height());
			
			var element = contentElement;
			var elementTop = 0;
			var elementLeft = 0;
			var menuSize = {};
			var menuPosition = {};

			while(element.parent.id !== root.id){
				if(_.isNumber(element.parent.position.top)){
					elementTop += Number(element.parent.position.top);			
				}
				if(_.isNumber(element.parent.position.left)){
					elementLeft += Number(element.parent.position.left);			
				}
				element = element.parent;
			}
			var elementBottom = elementTop + contentElement.el.height();
			var elementRight = elementLeft + contentElement.el.width();
			
			menuSize = { "width": 65, "height": (Number(contentElementProperties.propertypages.length) -1) * 40 };
		
			var menuTopTest = Number(elementTop + Number(menuSize['height']));
			var valign = null; 
			if(menuTopTest > pageHeight){
				menuPosition.top = elementBottom - menuSize.height;
				valign = 'bottom';			
			} else {
				menuPosition.top = elementTop;
				valign = 'top';			
			}
			
			var side = null;
			if(Number(elementRight + propertiesWidth) + 49 > pageWidth){
				menuPosition.left = elementLeft - 65;
				side = 'left'
			} else {
				menuPosition.left = elementRight;
				side = 'right'
			}
			
			menuPosition.left = menuPosition.left + 80;
			var result = {
				'size': menuSize,
				'position': menuPosition,
				'side': side,
				'valign': valign
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
						ZEN.notify ("ui.FloatMenu", message.sourceElement);
					}
				},
				
				propertiesPosition: function(menuButton, currentPage){
					var self = this;
					var root = ZEN.objects['bublEditor'];
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
					var pageHeight = root.el.height();
					
					var top = 0;
					var left = 0;
					var propertiesSize = {
						'width': '300',
						'height': self.propertiesForm.height + 100
					};
					var propertiesPosition = {};
					
					if(self.parent.position.top + self.propertiesForm.height + 100 < pageHeight){
						propertiesPosition.top = self.parent.position.top;						
					} else {
						var menuBottom = self.parent.position.top + self.menuItems.length -1 * 40;
						var propertiesTop = menuBottom - self.propertiesForm.height + 100;
						propertiesPosition.top = propertiesTop;
					}
					
					if(self.params.side === 'right'){
						propertiesPosition.left = self.parent.position.left +65 -80;		
					} else {
						propertiesPosition.left = self.parent.position.left -80 -300;
					}
					
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
							if(menuItem == $(menuButton).attr('id')){
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
					
					$('#' + self.el.attr('id') +  ' .menuItem').css('background-color', 'rgba(0,0,0,0.4)');
					$(sourceElement).css('background-color', 'rgba(0,0,0,1)');
					self.propertiesArrow.css('top', currentPage * 32 + 'px');
					
					
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

						self.leftArrow = $('<div></div>').addClass('leftArrow').addClass('arrow-left').appendTo(this.el);
						self.rightArrow = $('<div></div>').addClass('rightArrow').addClass('arrow-right').appendTo(this.el);
						
						if(self.params.side === 'right'){
							self.propertiesArrow = self.rightArrow;
							self.controlArrow = self.leftArrow;
						} else {
							self.propertiesArrow = self.leftArrow;							
							self.controlArrow = self.rightArrow;
						}
						
						if(self.params.valign === 'bottom'){
							self.controlArrow.css('bottom', '0px');							
						} else {
							self.controlArrow.css('top', '0px');														
						}
						self.propertiesArrow.css('top', '0px');
						self.menuItems = [];
								
						_.each(this.params.definition.propertypages,
							function(menuItem){
								var menuItemDiv = $('<div>' + menuItem.text + '</div>').addClass('menuItem').appendTo(menu);
								menuItemDiv.attr('title', menuItem.label);
								menuItemDiv.attr('id', self.id + '.' + menuItem.id);
								self.menuItems.push(menuItemDiv.attr('id'));
							}
						);
						self.showProperties(document.getElementById(self.menuItems[0]));
						
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
