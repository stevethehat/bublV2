"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function IconLabel (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		IconLabel.prototype = new ZEN.ui.Control();

		_.extend(
			IconLabel.prototype,
			{
				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
					
					ZEN.events.buttonHandler(this, this.el);
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
						ZEN.notify ("ui.button", message);
					}
				},

				label: function () {
				},
				
				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('iconLabel');
						$('<i class="fa ' + this.params.content.icon + ' fa-1x"/>').appendTo(this.el);
						if(this.params.content.label !== undefined){
							var label = $('<span>' + this.params.content.label + '</span>').appendTo(this.el);
							if(this.params.title !== undefined){
								label.attr('title', this.params.title);
							}
						}			
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('IconLabel',IconLabel);

		return {
			IconLabel: IconLabel
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
