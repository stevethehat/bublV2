/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function FormSelect (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		FormSelect.prototype = new ZEN.ui.Control();
		
		_.extend(
			FormSelect.prototype,
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
						var select = $('<select/>').attr('data-source', this.params.source).appendTo(container); 
						
						_.each(this.params.options,
							function(option){
								var option = $('<option>' + option.label + '</option>').attr('value', option.value).appendTo(select);
							}	
						);
						select.val(this.params.value)
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('FormSelect', FormSelect);

		return {
			FormSelect: FormSelect
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
