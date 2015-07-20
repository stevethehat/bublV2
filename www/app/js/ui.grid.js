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
