"use strict";
var ZEN = (typeof ZEN === undefined) ? {} : ZEN;

function ContainerControl (params, parent) {
	if (arguments.length > 0) {
 		ZEN.ui.Base.call(this, params, parent);
    }
    return this;
}

ContainerControl.prototype = new ZEN.ui.Base();

_.extend(
	ContainerControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Base.prototype.init.call(this, params, parent);
			},
			render: function () {
				this.addElement('<div/>');
			}
		}
);

function HeaderControl (params, parent) {
	if (arguments.length > 0) {
 		ZEN.ui.Control.call(this, params, parent);
    }
    return this;
}

HeaderControl.prototype = new ZEN.ui.Control();

_.extend(
	HeaderControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Control.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				$('<h1/>').text(params.content).appendTo(this.el);
			}
		}
);


function ButtonControl (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.Control.call(this, params, parent);
    }
    return this;
}

ButtonControl.prototype = new ZEN.ui.Control();
_.extend(
	ButtonControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Control.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				$('<button/>').text(params.content).appendTo(this.el);
			}
		}
);

function Image (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.Control.call(this, params, parent);
    }
    return this;
}
Image.prototype = new ZEN.ui.Control();
_.extend(
	Image.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Control.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				var img = $('<img/>').attr('src', params.url);
				img.on('load',
					function(){
						ZEN.notify('pageevents', { 'event': 'imageloaded', 'data': { 'img': img } });
					}
				); 
				img.appendTo(this.el);
			}
		}
);

function TextControl (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.Control.call(this, params, parent);
    }
    return this;
}
TextControl.prototype = new ZEN.ui.Control();
_.extend(
	TextControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Control.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				$('<p/>').text(params.content).appendTo(this.el);
			}
		}
);

function ContentSwitcherControl (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.Control.call(this, params, parent);
    }
    return this;
}
ContentSwitcherControl.prototype = new ZEN.ui.Control();
_.extend(
	ContentSwitcherControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Control.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				$('<p/>').text(params.content).appendTo(this.el);
			}
		}
);

function LauncherControl (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.Control.call(this, params, parent);
    }
    return this;
}
LauncherControl.prototype = new ZEN.ui.Control();
_.extend(
	LauncherControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Control.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				this.el.addClass('launcher');
				var img = $('<img class="thumbnail"/>').appendTo(this.el);
				var heading = $('<h2/>').text(params.content.heading).appendTo(this.el);
				var description  = $('<p/>').text(params.content.description).appendTo(this.el);
				var arrow = $('<div class="go"><i class="fa fa-chevron-right fa-2x"></i></div>').appendTo(this.el);
			}
		}
);

function LabelButtonControl (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.Control.call(this, params, parent);
    }
    return this;
}
LabelButtonControl.prototype = new ZEN.ui.Control();
_.extend(
	LabelButtonControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Control.prototype.init.call(this, params, parent);
			},
			render: function (params) {
				this.el.addClass('labelbutton');
				var i = $('<i class="fa ' + params.content.icon + ' fa-' + params.content.size + 'x"/>').appendTo(this.el);
				var label = $('<span/>').text(params.content.label).appendTo(this.el);
			}
		}
);

function GridControl (params, parent) {
    if (arguments.length > 0) {
		ZEN.ui.Control.call(this, params, parent);
    }
    return this;
}
GridControl.prototype = new ZEN.ui.Control();
_.extend(
	GridControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Control.prototype.init.call(this, params, parent);
			}
		}
);

function CrossFaderControl (params, parent) {
	if (arguments.length > 0) {
 		ZEN.ui.Control.call(this, params, parent);
    }
    return this;
}

CrossFaderControl.prototype = new ZEN.ui.Control();

_.extend(
	CrossFaderControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Control.prototype.init.call(this, params, parent);
			},
			render: function () {
				this.el.addClass('crossfader');				
				this.params.children[0].class = 'front';
				this.params.children[1].class = 'back';
			}
		}
);

function ThumbnailMenuItemControl (params, parent) {
	if (arguments.length > 0) {
 		ZEN.ui.Control.call(this, params, parent);
    }
    return this;
}

ThumbnailMenuItemControl.prototype = new ZEN.ui.Control();

_.extend(
	ThumbnailMenuItemControl.prototype,
		{
			init: function (params, parent) {
				// call the base class init method
				ZEN.ui.Control.prototype.init.call(this, params, parent);
			},
			render: function () {
				this.el.addClass('crossfader thumbnailMI');	
				var backColor = '';
				var color = '';	
				var front = $('<div class="front"/>').appendTo(this.el);		
				var back = $('<div class="back"/>').appendTo(this.el);
				var img = $('<img />').attr('src', this.params.content.imageurl).appendTo(front);
				$('<h1/>').text(this.params.content.heading).appendTo(back);
				$('<p/>').text(this.params.content.description).appendTo(back);
				
				if(this.params.menu && this.params.menu.length > 0){
					var controls = $('<div class="controls"/>').appendTo(back);
					
					function addControl(action, icon, label){
						var control = $('<span data-action="' + action + '" class="control"/>').appendTo(controls);
						$('<i title="' + label + '" class="fa ' + icon + ' fa-2x"/>').appendTo(control);
						$('<span>' + label + '</span>').appendTo(control);
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
				img.on('load',
					function(){
				        var htmlImage = img.get(0);
				        var colorThief = new ColorThief();
				        var palette = colorThief.getPalette(htmlImage);

						backColor = cssColor(palette[2]);	
						color = cssColor(palette[1]);	
						back.css(
							{
								'background-color': backColor,
								'color': color	
							}
						);
					}	
				);				
			},
			
			click: function(params){
				var action = '';				
				var control = this.calculateTargetElement('#' + this.id + ' span.control', params.x, params.y);
				if(control != null){
					action = control.attr('data-action'); 
				} else {
					if(this.params.actions && this.params.actions.click){
						action = this.params.actions.click;
					}
				}
				return(action);
			}
		}
);



ZEN.registerType('Container',ContainerControl);
ZEN.registerType('Header',HeaderControl);
ZEN.registerType('Image', Image);
ZEN.registerType('Button', ButtonControl);
ZEN.registerType('Text', TextControl);
ZEN.registerType('ContentSwitcher', ContentSwitcherControl);
ZEN.registerType('Launcher', LauncherControl);
ZEN.registerType('LabelButton', LabelButtonControl);
ZEN.registerType('Grid', GridControl);
ZEN.registerType('CrossFader', CrossFaderControl);
ZEN.registerType('ThubmnailMenuItem', ThumbnailMenuItemControl);

console.log(ZEN);
