/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function BublRows (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.BublControl.call(this, params, parent);
			}
			return this;
		}

		BublRows.prototype = new ZEN.ui.BublControl();
		
		_.extend(
			BublRows.prototype,
			{

				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.BublControl.prototype.init.call(this, params, parent);
					ZEN.events.buttonHandler (this, this.el);
				},
				getElement: function () {
					var self = this;
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('zen-rows');
						self.setupStylingDiv();
						
						if(this.params.content && this.params.content.url !== undefined){
							//this.el.html('<img width="' + this.parent.el.width() + '" height="' + this.parent.el.height() + '" src="' + this.params.content.url + '"/>');
							self.stylingDiv.html('<img width="100%" height="100%" src="' + this.params.content.url + '"/>');
						} else {
							if(bublApp.displayMode === 'app'){
								//alert(this.params.content.columns + ' columns');
								self.stylingDiv.html('<p>Rows</p>');
							}						
						}
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('BublRows', BublRows);

		return {
			BublRows: BublRows
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
