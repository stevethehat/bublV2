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
						this.el.attr('title', this.params.content.bgtop + ' ' + this.params.content.bgleft + ' ' + this.params.content.bgwidth + 'x' + this.params.content.bgheight)
						//this.imageLayer.css('background-size', this.params.content.bgwidth + ' ' + this.params.content.bgheight);
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
						var backgroundDetails = {
							'background-image':'url('+this._image+')',
							'background-size': this.params.content.bgwidth + 'px ' + this.params.content.bgheight + 'px',
							'background-position': 'top ' + this.params.content.bgtop + 'px left ' + this.params.content.bgleft + 'px'
						}
						this.imageLayer.css(backgroundDetails);
						return this;
					} else {
						return this._image;
					}
				}
			}
		);

		ZEN.registerType('msMenuBox', msMenuBox);

		return {
			msMenuBox: msMenuBox
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
