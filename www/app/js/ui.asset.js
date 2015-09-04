"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function Asset (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		Asset.prototype = new ZEN.ui.Control();

		_.extend(
			Asset.prototype,
			{
				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
					
					ZEN.events.buttonHandler(this, this.el);
				},

				notify: function (message) {
					message.source = this;

					ZEN.log(message.type);
					if(message.type === 'active') {
						ZEN.notify ("ui.asset", message);
					}
				},

				label: function () {
				},
				
				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('Asset', Asset);

		return {
			Asset: Asset
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
