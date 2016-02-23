/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function FormNumberCombo (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.form.Input.call(this, params, parent);
			}
			return this;
		}

		FormNumberCombo.prototype = new ZEN.ui.form.Input();
		
		_.extend(
			FormNumberCombo.prototype,
			{
				init: function (params, parent) {
					// call the base class init method
                    //params.id = params.id.replace(/\./g, '-');
					ZEN.ui.form.Input.prototype.init.call(this, params, parent);
				},
				
				label: function () {
				},
                
                addInput: function(field, value){
                    var div = $('<div/>').appendTo(this.container);
                    $('<label>' + field.label + '</label>').appendTo(div);
                    var input = $('<input data-source="' + field.source + '" type="Number"/>').appendTo(div);
                    if(this.params.postFix !== undefined && this.params.postFix !== null){
                        value = bublUtil.safeNumber(value);
                    }
                    input.val(value);    
                },
				
				getElement: function () {
					var self = this;
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('zen-formedit');
                        $('<div>' + this.params.label + '</div>').appendTo(this.el)
						this.container = $('<div/>').addClass('formNumberCombo').appendTo(this.el);
                        this.inputEl = this.el;
                        this.container.css(
                            {
                                'background-color': 'red'
                            }                           
                        );
                        
                        var index = 0;
                        var values = this.params.value;
                        _.each(this.params.fields,
                            function(field){
                                if(values !== null && values !== undefined){
                                    self.addInput(field, values[field.source]);                                
                                } else {
                                    self.addInput(field, field.default);                                                                    
                                }
                                index++;
                            }
                        )
                        
						this.resize();
					}
					return this.el;
				},
                
				setValue: function (value) {
					if (this.inputType === 'file' && value !== '') {
						this.imageEl.css('background-image', 'url('+value+')');
					} else {
						this.inputEl.val(value);
					}
				},
                
				value: function (value) {
                    var self = this;
					var val;
					if (value !== undefined) {
						this.setValue(value);
						return this;
					} else {
                        var result = {};
                        var elementID = this.el.attr('id');
                        this.el.find('input').each(
                            function(index, input){
                                input = $(input);
                                var value = input.val();
                                if(self.params.postFix !== undefined && self.params.postFix !== null){
                                    value = value + self.params.postFix;
                                }
                                
                                result[input.attr('data-source')] = value;
                            }
                        );
                        //alert(JSON.stringify(result));
						return result;
					}
				}                
			}
		);

		ZEN.registerType('FormNumberCombo', FormNumberCombo);

		return {
			FormNumberCombo: FormNumberCombo
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
