/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function FormNumber (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		FormNumber.prototype = new ZEN.ui.Control();
		
		_.extend(
			FormNumber.prototype,
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
						this.el.addClass('zen-formnumber');
						var container = $('<div/>').addClass('formElementContainer').appendTo(this.el);
						var label = $('<label>' + this.params.label + '</label>').appendTo(container);
						var edit = $('<input type="number"/>')
							.attr('data-source', this.params.source)
							.attr('value', this.params.value)
							.appendTo(container);

						if(this.params.datatype !== undefined){
							edit.attr('data-type', this.params.datatype);
						} else {
							edit.attr('data-type', 'Number');
						}							
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('FormNumber', FormNumber);

		return {
			FormNumber: FormNumber
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
