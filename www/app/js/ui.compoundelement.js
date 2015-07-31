"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function CompoundElement (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		CompoundElement.prototype = new ZEN.ui.Control();

		_.extend(
			CompoundElement.prototype,
			{
				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
					
					ZEN.events.buttonHandler(this, this.el);
				},

				notify: function (message) {
					message.source = this;

					ZEN.log('compound element', message.type);
					var element = $(message.sourceElement);
					var isTagged = message.sourceElement && element.data('tag') !== undefined;
					
					if(isTagged){
						if (message.type === 'highlight') {
							element.addClass('wobble animated');
							element.css( { 'color': '#348EBF', 'cursor': 'pointer'} );
						} else {
							element.removeClass('wobble animated');
							element.css( { 'color': 'black', 'cursor': 'auto'} );
						}
		
						if(message.type === 'active'){
							ZEN.log('got action:', element.data('tag') + ' ' + message.type);
							bublApp.executeAction(element.data('tag'), message);
						}
					}
					/*
					if(message.type === 'active') {
						ZEN.notify ("ui.button", message);
					}
					*/
				},

				label: function () {
				},
				
				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.html(this.params.label);
						
						/*
						$('[data-tag]').each(
							function(index, element){
								element = $(element);
								var tag = element.attr('data-tag');
								element.data('tag', tag);
							}
						);
						*/
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('CompoundElement',CompoundElement);

		return {
			CompoundElement: CompoundElement
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
