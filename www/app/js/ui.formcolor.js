/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function FormColor (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		FormColor.prototype = new ZEN.ui.Control();
		
		_.extend(
			FormColor.prototype,
			{
				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
				},
				
				label: function () {
				},
				
				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('zen-formedit');
						var container = $('<div/>').addClass('formElementContainer').appendTo(this.el);
						var label = $('<label>' + this.params.label + '</label>').appendTo(container);
						var edit = $('<input type="color" value="' + this.params.value +'"/>')
							.attr('id', 'colorpicker' + this.id)
							.attr('data-source', this.params.source)
							.appendTo(container);
							
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('FormColor', FormColor);

		return {
			FormColor: FormColor
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
