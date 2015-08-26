/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {
		function FormDataList (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		FormDataList.prototype = new ZEN.ui.Control();
		
		_.extend(
			FormDataList.prototype,
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
						if(this.params.label != undefined){
							var label = $('<label>' + this.params.label + '</label>').appendTo(container);
						}
						var input = $('<input/>').attr('list', this.id + 'list').attr('data-source', this.params.source).appendTo(container);
						//alert('datalist (' + this.params.source + '=) datatype = ' + this.params['datatype']);
						if(this.params['datatype'] !== undefined){
							input.attr('data-type', this.params['datatype']);
						}
						var select = $('<datalist/>').attr('id', this.id + 'list').appendTo(container); 
						
						_.each(this.params.options,
							function(option){
								var option = $('<option/>').attr('value', option.value).appendTo(select);
							}	
						);
						input.val(this.params.value)
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('FormDataList', FormDataList);

		return {
			FormDataList: FormDataList
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
