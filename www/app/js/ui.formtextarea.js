/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function FormTextArea (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		FormTextArea.prototype = new ZEN.ui.Control();
		
		_.extend(
			FormTextArea.prototype,
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
						var value = this.params.value;
						if(value.indexOf('</') !== -1){
							value = $(value).text();
						}
						this.el.addClass('zen-formedit');
						var container = $('<div/>').addClass('formElementContainer').appendTo(this.el);
						var label = $('<label>' + this.params.label + '</label>').appendTo(container);
						var edit = $('<textarea/>')
							.attr('data-source', this.params.source)
							.attr('style', 'height:80px')
							.val(value)
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

		ZEN.registerType('FormTextArea', FormTextArea);

		return {
			FormTextArea: FormTextArea
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
