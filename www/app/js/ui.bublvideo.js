/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function BublVideo (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.BublControl.call(this, params, parent);
			}
			return this;
		}

		BublVideo.prototype = new ZEN.ui.BublControl();
		
		_.extend(
			BublVideo.prototype,
			{
				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
					ZEN.events.buttonHandler (this, this.el);
				},
				
				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('zen-video');
												
						if(this.params.content && this.params.content.url !== undefined){
							//var video = $('<video width="' + this.parent.el.width() + '" height="' + this.parent.el.height() + '" controls/>').appendTo(this.el);
							var video = $('<video width="100%" height="100%" controls/>').appendTo(this.el);
							var source = $('<source src="' + this.params.content.url + '" type="video/mp4"/>').appendTo(video);
						} else {
							this.el.html('<p>Please select a video</p>');						
						}
						this.resize();
					}
					return this.el;
				}
			}
		);

		ZEN.registerType('BublVideo', BublVideo);

		return {
			BublVideo: BublVideo
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
