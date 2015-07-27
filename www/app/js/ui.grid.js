/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function Grid (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		Grid.prototype = new ZEN.ui.Control();
		
		Grid.populate = function(children, gridChildren){
			ZEN.log('populate grid', children);
			_.each(children,
				function(child){
					gridChildren.push(
						{ 
							'id': 'bubl' + child.id,
					 	 	'content': { 'imageurl': child.thumbnail, 'heading': child.title, 'description': child.description } 
						}				
					);
				}
			);
		}

		Grid.preProcess = function(data){
			var gridView =
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
						gridView.children.push(currentRow);
					}	
					currentRow.children.push(child);
					col++;
					if(col === 3){
						col = 0;
					}
				}
			);
			return [gridView];	
		},
		
		_.extend(
			Grid.prototype,
			{

				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
					//ZEN.events.GridHandler (this, this.el);
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
						ZEN.notify ("ui.Grid", message);
					}
				},

				
				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						// this.el.attr('tabindex',0);
						this.el.addClass('zen-Grid');
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('Grid',Grid);

		return {
			Grid: Grid
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
