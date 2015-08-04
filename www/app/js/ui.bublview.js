"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function BublView (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.View.call(this, params, parent);
			}
			return this;
		}

		BublView.prototype = new ZEN.ui.View();

		_.extend(
			BublView.prototype,
			{
				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.View.prototype.init.call(this, params, parent);
				},

				/*
				notify: function (message) {
					message.source = this;

					ZEN.log(message.type);
					
					if (message.type === 'highlight') {
						this.el.addClass('hover');
					} else {
						this.el.removeClass('hover');
					}

					if(message.type === 'active') {
						ZEN.log('active on bublView');
						ZEN.notify ("ui.bublcontrol", message);
					}
				},
				*/
				label: function () {
				},
				
				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						if(this.params.css !== undefined){
							this.el.css(this.params.css);
						}
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('BublView', BublView);

		return {
			BublView: BublView
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
