/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function FormCheck (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		FormCheck.prototype = new ZEN.ui.Control();
		
		_.extend(
			FormCheck.prototype,
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
						var edit = $('<input type="checkbox" placeholder="' + this.params.placeholder + '"/>')
							.attr('data-source', this.params.source)
							.attr('checked', this.params.value)
							.appendTo(container);
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('FormCheck', FormCheck);

		return {
			FormCheck: FormCheck
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
