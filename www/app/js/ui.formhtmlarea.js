/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function FormHtmlArea (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		FormHtmlArea.prototype = new ZEN.ui.Control();
		
		_.extend(
			FormHtmlArea.prototype,
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
						var editorID = this.el.attr('id') + 'editor';
						/*
						var edit = $('<textarea id="' + editorID + '"/>')
							.attr('data-source', this.params.source)
							.attr('data-type', 'html')
							.attr('style', 'height:80px')
							.attr('class', 'htmlEditor')
							.val(value)
							.appendTo(container);
						if(this.params.placeholder !== undefined){
							edit.attr('placeholder', this.params.placeholder);
						}
						*/
						var div = $('<div contenteditable="true">can we edit this???</div>')
							.css({
								'width': '100%',
								'height': '100%'	
							})
							.appendTo(container);
						//var iframeBody = $(iframe.contents().find('body'));
						//iframeBody.html('<h1>we are in the iframe</h1>');
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('FormHtmlArea', FormHtmlArea);

		return {
			FormTextArea: FormHtmlArea
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
