"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function ThumbnailMenu (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		ThumbnailMenu.prototype = new ZEN.ui.Control();

		_.extend(
			ThumbnailMenu.prototype,
			{
				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
					
					ZEN.events.buttonHandler(this, this.el);
				},

				notify: function (message) {
					message.source = this;

					if (message.type === 'highlight') {
						this.el.addClass('highlight');
					}
					if (message.type === 'inactive') {
						this.el.removeClass('highlight');
					}
					if (message.sourceElement && $(message.sourceElement).data('tag') !== undefined) {
						if(message.type === 'active'){
							ZEN.log('got action:', $(message.sourceElement).data('tag') + ' ' + message.type);
							bublApp.executeAction($(message.sourceElement).data('tag'), message);
							//ZEN.notify(message)
						}
					}
				},

				label: function () {
				},
				
				getElement: function () {
					var self = this;
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('zen-ThumbnailMenu');
						
						this.el.addClass('thumbnailMI');	
						var backColor = '';
						var color = '';	
						var front = $('<div class="front"/>').appendTo(this.el);		
						//var back = $('<div class="back"/>').appendTo(this.el).css({ 'background-color': 'white', 'color': 'black' });
						var back = $('<div class="back"/>').css({ 'background-color': 'white', 'color': 'black' }).appendTo(this.el);
						back.data('tag', 'select');
						
						var src = bublAssets.getSecureUrl(this.params.content.imageurl)
						
						var img = $('<img width="' + this.params.size.width + '" height="' + this.params.size.height + '"/>').attr('src', src).appendTo(front);
						this.heading = $('<h3/>').text(this.params.content.heading).appendTo(back).data('tag', 'editHeading');
						this.description = $('<p/>').text(this.params.content.description).appendTo(back).data('tag', 'editDescription');

						if(this.params.menu && this.params.menu.length > 0){
							var controls = $('<div class="controls"/>').appendTo(back);
							controls.css(
								{
									'border': 'solid 1px ' + color
								}
							);
							
							function addControl(action, icon, label){
								var control = $('<span class="control"/>').appendTo(controls);
								control.data('tag', action);
								$('<i title="' + label + '" class="fa ' + icon + ' fa-1x"/>').appendTo(control).data('tag', action);
								$('<span>' + label + '</span>').appendTo(control).data('tag', action);
							}
							
							_.each(this.params.menu,
								function(control){
									addControl(control.action, control.icon, control.label);		
								}
							);
							front.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', 
								function() { 
									if(front.css('opacity') == 0){
										controls.css(
											{
												'color': color,
												'border-color': color
											}
										);
										controls.css( { 'display': 'block' } );
									} else {
										controls.css( { 'display': 'none' } );
									}
								}
							);
						}					
						
						function cssColor(color){
							var cssColor = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
							return(cssColor);
						}
						
						function getContrastYIQ(hexcolor){
							var r = parseInt(hexcolor.substr(0,2),16);
							var g = parseInt(hexcolor.substr(2,2),16);
							var b = parseInt(hexcolor.substr(4,2),16);
							var yiq = ((r*299)+(g*587)+(b*114))/1000;
							return (yiq >= 128) ? 'black' : 'white';
						}
						
						if(this.params.content.backcolor === undefined && this.params.content.color === undefined){
							//alert('work out background color ' + JSON.stringify(self.params.content, null, 4));
							img.on('load',
								function(){
							        var htmlImage = img.get(0);
							        var colorThief = new ColorThief();
							        var palette = colorThief.getPalette(htmlImage);
									
									backColor = cssColor(palette[2]);	
									//alert('src = ' + backColor);
			
									//color = cssColor(palette[1]);
									color = getContrastYIQ(backColor);	
									back.css(
										{
											'background-color': backColor,
											'color': color	
										}
									);
								}	
							);
						} else {
							back.css(
								{
									'background-color': this.params.content.backcolor,
									'color': this.params.content.color	
								}
							);							
						}				
						this.resize();
					}
					return this.el;
				},
				editHeading: function(){
					ZEN.log('edit Heading', this.heading);
					this.heading.css('z-index', 100000000);
					this.heading.attr('contenteditable', 'true');
					
				}
			}
		);

		ZEN.registerType('ThumbnailMenu',ThumbnailMenu);

		return {
			ThumbnailMenu: ThumbnailMenu
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
