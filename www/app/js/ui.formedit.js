/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function FormEdit (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		FormEdit.prototype = new ZEN.ui.Control();
		
		_.extend(
			FormEdit.prototype,
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
						var edit = $('<input type="text""/>')
							.attr('data-source', this.params.source)
							.val(this.params.value)
							.appendTo(container);
						if(this.params.placeholder !== undefined){
							edit.attr('placeholder', this.params.placeholder);
						}						
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('FormEdit', FormEdit);

		return {
			FormEdit: FormEdit
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
