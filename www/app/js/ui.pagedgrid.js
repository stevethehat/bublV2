/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function PagedGrid (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		PagedGrid.prototype = new ZEN.ui.Control();
		
		PagedGrid.populate = function(object, PagedGridChildren, sortOrder, callback){
			ZEN.log('populate PagedGrid', object.children);
	
			var page = bublApp.variables['gridcurrentpage'];
			if(page === undefined){
				page = 0;
				bublApp.variables['gridcurrentpage'] = 0;
			}
			
			if(sortOrder === undefined || sortOrder === null){
				sortOrder = 'asc';
			}
			
			if(object.children === undefined){
				object.children = [];
			}
			
			if(sortOrder === 'asc'){
				object.children.sort(
					function(a, b){
						return(a.order > b.order);
					}
				);
			} else {
				object.children.sort(
					function(a, b){
						return(a.order < b.order);
					}
				);				
			}
			
			bublApp.variables['gridnumpages'] = Math.ceil(object.children.length / 6);
			var pageStart = page * 6;
			var pageChildren = object.children.slice(pageStart, pageStart + 6);
						 			
			_.each(pageChildren,
				function(child){
					var imageUrl = null;
					if(child.thumbnails !== undefined){
						imageUrl = child.thumbnails['340x200'];
					}

					if(imageUrl === undefined || imageUrl === null){
						imageUrl = 'img/defaults/unknown.png';
					}

					var childContent = { 
							'id': 'bubl' + child.id,
							'type': 'ThumbnailMenu',
					 	 	'content': { 
								'imageurl': imageUrl, 
								'heading': child.title, 
								'description': child.description, 
								'backcolor': child['majorColor'], 
								'color': child['contrastColor'] 
							},
							'data': child 
						};				

					bublAssets.addSecureUrlRequest(imageUrl);
					if(imageUrl.indexOf('/defaults/') != -1){
						childContent.content.color ='#fff';
						childContent.content.backcolor ='#aaa';						
					}
					PagedGridChildren.push(childContent);
				}
			);
			bublAssets.processSecureUrlRequests(callback);
		}

		PagedGrid.preProcess = function(data){
			var PagedGridView =
				{
					'type': 'View',
					'layout': { 'style': 'vertical' },
					'children': []
				};
			var row = 0;
			var currentRow = null;
			var col = 0;
			var rowsAdded = 0;
			
			_.each(data['children'],
				function(child){
					if(col === 0){
						// create new row
						currentRow = {
							'type': 'View',
							'layout': { 'style': 'horizontal' },
							'children': []								
						};
						PagedGridView.children.push(currentRow);
						rowsAdded++;
					}	
					currentRow.children.push(child);
					col++;
					if(col === 3){
						col = 0;
					}
				}
			);
			
			if(rowsAdded === 1){
				currentRow = {
					'type': 'View',
					'layout': { 'style': 'horizontal' },
					'children': [
						{
							'type': 'View'
						}
					]								
				};
				PagedGridView.children.push(currentRow);				
			}
			
			//alert('num pages = ' + bublApp.variables['gridnumpages']);
			
			var numPages = bublApp.variables['gridnumpages']; 
			if(numPages > 1){
				var page = bublApp.variables['gridcurrentpage'];
				var pager = {
					'type': 'View',
					'layout': { 'style': 'horizontal' },
					'margin': { 'top': 10 },
					'children': []								
				}
				if(page > 0){
					pager.children.push(
						{
							'type': 'IconLabel',
							'tag': 'gridprevious',
							'content': {
								'label': 'Previous',
								'icon': 'fa-chevron-left'
							},
							'size': { 'width' : 100 }
						}						
					);					
				} 
				if(page < (numPages -1)){
					pager.children.push(
						{
							'type': 'IconLabel',
							'tag': 'gridnext',
							'content': {
								'label': 'Next',
								'icon': 'fa-chevron-right'
							},
							'size': { 'width' : 80 }							
						}
					);
				}
				PagedGridView.children.push(pager);
			}
			
			ZEN.log('Grid = ', PagedGridView);
			return [PagedGridView];	
		},
		
		_.extend(
			PagedGrid.prototype,
			{

				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
					//ZEN.events.PagedGridHandler (this, this.el);
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
						ZEN.notify ("ui.PagedGrid", message);
					}
				},

				
				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						// this.el.attr('tabindex',0);
						this.el.addClass('zen-PagedGrid');
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('PagedGrid',PagedGrid);

		return {
			PagedGrid: PagedGrid
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
