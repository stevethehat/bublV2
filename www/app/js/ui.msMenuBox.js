"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function msMenuBox (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.LayoutControl.call(this, params, parent);
			}
			return this;
		}

		msMenuBox.prototype = new ZEN.ui.LayoutControl();

		_.extend(
			msMenuBox.prototype,
			{
				init: function (params, parent) {
					this.colourLayer = null;
					this.imageLayer = null;
					ZEN.ui.LayoutControl.prototype.init.call(this, params, parent);
				},

				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('ms-menu-box');
						this.imageLayer = $('<div class="bg-image" />');
						this.imageLayer.prependTo(this.el);						 
						this.colourLayer = $('<div class="bg-colour" />');
						this.colourLayer.prependTo(this.el);
						this.resize();
					}
					return this.el;
				},

				opacity: function (value) {
					if (value !== undefined) {
						this._opacity = value;
						this.colourLayer.css('opacity',this._opacity);
						return this;
					} else {
						return this._opacity;
					}
				},

				image: function (value) {
					if (value !== undefined) {
						this._image = value;
						this.imageLayer.css({
							'background-image':'url('+this._image+')'
						});
						return this;
					} else {
						return this._image;
					}
				},
				
			}
		);

		ZEN.registerType('msMenuBox', msMenuBox);

		return {
			msMenuBox: msMenuBox
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
