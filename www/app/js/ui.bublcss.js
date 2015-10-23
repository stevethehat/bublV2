/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function BublCSS (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		BublCSS.prototype = new ZEN.ui.Control();
		
		_.extend(
			BublCSS.prototype,
			{

				init: function (params, parent) {
					ZEN.ui.Control.prototype.init.call(this, params, parent);
				},

				label: function () {
				},
				
				getElement: function () {
					var self = this;
					if (this.el === null) {
						//alert('in bubl css ' + JSON.stringify(this.params.definition, null, 2));
						var allStyles = '';						
						$.each(this.params.definition,
							function(index, styleDefinition){
								ZEN.log('class = ' + styleDefinition.class);
								var css = '';
								for(var style in styleDefinition.styles){
									css = css + style + ':' + styleDefinition.styles[style] + ';\n';
									$('.' + styleDefinition.class).css(style, styleDefinition.styles[style]);
									ZEN.log('set .' + styleDefinition.class + ' ' + style + ' = ' + styleDefinition.styles[style])								
								}
							}
						);
						var styles = $('head').append($('<style type="text/css"/>'));
						this.el = styles;
						
						this.resize();
					}
					return this.el;
				}				
			}
		);

		ZEN.registerType('BublCSS',BublCSS);
		return {
			BublCSS: BublCSS
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
