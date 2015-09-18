/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function FormRange (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		FormRange.prototype = new ZEN.ui.Control();
		
		_.extend(
			FormRange.prototype,
			{
				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
				},
				
				label: function () {
				},
				
				getElement: function () {
					var self = this;
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('zen-formedit');
						var container = $('<div/>').addClass('formElementContainer').appendTo(this.el);
						var label = $('<label>' + this.params.label + ' ' + this.params.value + '</label>').appendTo(container);
						var edit = $('<input type="range"/>')
							.attr('data-source', this.params.source)
							.attr('data-type', 'Number')
							.attr('value', this.params.value)
							.appendTo(container);
							
						if(this.params.min !== undefined && this.params.min !== null){
							edit.attr('min', this.params.min);
						}	
						if(this.params.max !== undefined && this.params.max !== null){
							edit.attr('max', this.params.max);
						}	
						
						edit.on('change',
							function(){
								label.text(self.params.label + ' ' + edit.val());
							}
						);
						
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('FormRange', FormRange);

		return {
			FormRange: FormRange
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
