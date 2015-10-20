/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function BublSlides (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.BublView.call(this, params, parent);
			}
			return this;
		}

		BublSlides.prototype = new ZEN.ui.BublView();
		
		_.extend(
			BublSlides.prototype,
			{

				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.BublView.prototype.init.call(this, params, parent);
					ZEN.events.buttonHandler (this, this.el);
				},
				initSlides: function(){
					if(this.params.children === undefined){
						this.params.children = [
							{
								'type': 'ContentArea',
								'size': { 'width': 'full', 'height': 'full' }
							}
						];
					}	
					
					
				},
				getElement: function () {
					var self = this;
					if (this.el === null) {
						if(this.params.layout === undefined){
							this.params.layout = { 'slides': 2 };
						}						
						self.initSlides();
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('zen-slides');
						//self.setupStylingDiv();
						
						//alert(this.params.layout.slides + ' slides');
						
						//self.stylingDiv.html('<p>Slides!!!</p>');
						this.resize();
					}
					return this.el;
				},
				setupControlPropertiesForm: function(form, callback){
					bublUtil.findID('currentslide', form,
						function(slideSelector){
							
							/*
							if(slideSelector.params === undefined || slideSelector.params === null){
								slideSelector.params = {};
							}
							*/
							slideSelector.min = 1;
							slideSelector.max = 2;
							slideSelector.default = 1;
							callback();	
						} 
					)
				}
			}
		);

		ZEN.registerType('BublSlides', BublSlides);

		return {
			BublSlides: BublSlides
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
