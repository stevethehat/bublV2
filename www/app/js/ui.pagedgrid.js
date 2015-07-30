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
		
		PagedGrid.populate = function(children, PagedGridChildren){
			ZEN.log('populate PagedGrid', children);
			_.each(children,
				function(child){
					PagedGridChildren.push(
						{ 
							'id': 'bubl' + child.id,
					 	 	'content': { 'imageurl': child.thumbnail, 'heading': child.title, 'description': child.description } 
						}				
					);
				}
			);
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
					}	
					currentRow.children.push(child);
					col++;
					if(col === 3){
						col = 0;
					}
				}
			);
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