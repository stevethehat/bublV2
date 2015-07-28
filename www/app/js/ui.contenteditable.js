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
		
		ContentEditable.populate = function(children, ContentEditableChildren){
			ZEN.log('populate ContentEditable', children);
			_.each(children,
				function(child){
					ContentEditableChildren.push(
						{ 
							'id': 'bubl' + child.id,
					 	 	'content': { 'imageurl': child.thumbnail, 'heading': child.title, 'description': child.description } 
						}				
					);
				}
			);
		}

		ContentEditable.preProcess = function(data){
			var ContentEditableView =
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
						ContentEditableView.children.push(currentRow);
					}	
					currentRow.children.push(child);
					col++;
					if(col === 3){
						col = 0;
					}
				}
			);
			return [ContentEditableView];	
		},
		
		_.extend(
			ContentEditable.prototype,
			{

				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
					//ZEN.events.ContentEditableHandler (this, this.el);
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
						ZEN.notify ("ui.contenteditable", message);
					}
				},

				
				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						// this.el.attr('tabindex',0);
						this.el.addClass('zen-contenteditable');
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
