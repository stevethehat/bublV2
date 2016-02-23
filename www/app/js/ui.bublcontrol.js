/// <reference path="../../typings/jquery.d.ts"/>

"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function BublControl (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		BublControl.prototype = new ZEN.ui.Control();
		
		_.extend(
			BublControl.prototype,
			{

				init: function (params, parent) {
					this.colourLayer = null;
					this.imageLayer = null;
					// call the base class init method
                    if(params.size === undefined || params.size === null){
                        params.size = { 'width': 'max', 'height': 'max'}
                    }
					params['view'] = { 
						'size': { 'width': params.size.width, 'height' : params.size.height }
					};
					
					if(params['position'] !== undefined){
						params['view']['position'] = params['position']; 
					}
					ZEN.ui.Control.prototype.init.call(this, params, parent);
					
					ZEN.events.buttonHandler (this, this.el);
				},
                
                getDimensions: function(){
                    var self = this;
                    var result = {
                        'top': null, 'left': null
                    };
                    var element = this;
        			var root = ZEN.objects['bublEditor'];
                    
                    while(element.parent.id !== root.id){
                        if(_.isNumber(element.parent.position.top)){
                            if(result.top === null){
                                result.top = 0;
                            }
                            result.top += Number(element.parent.position.top);			
                        }
                        if(_.isNumber(element.parent.position.left)){
                            if(result.left === null){
                                result.left = 0;
                            }
                            result.left += Number(element.parent.position.left);			
                        }
                        element = element.parent;
                    }
                    if(result.top === null){
                        result.top = self.el.offset().top - 84;
                    }
                    if(result.left === null){
                        result.left = self.el.offset().left -80;
                    }
                    
                    result.bottom = result.top + self.el.height();
                    result.right = result.left + self.el.width();
                    result.width = self.el.width();
                    result.height = self.el.height();
                    
                    
                    return(result);
                },

				label: function () {
				},
				
				update: function(data){
					var self = this;
					_.each(data,
						function(value, key){
							self.setValue(key, value);
						}
					);
					//self.parent.resize();
				},
				
				positioning: function(){
					return(
						{
							'top': this.el.top,
							'left': this.el.left,
							'width': this.el.width(),
							'height': this.el.height(),
						}
					);	
				},
				
				getProperties: function(callback){
					var self = this;
					ZEN.data.load(
						'app/definitions/' + self.type + '.json',
						{},
						function(data){
							ZEN.data.load('app/definitions/style.json', {},
								function (styling) {
									data.propertypages = data.propertypages.concat(styling.propertypages);
									self.propertiesDefinition = data; 
									callback(data);
								}
							);									
						}
					)								
				},
				
				getPropertiesForm: function(pageNo, callback){
					var self = this;
					var page = self.propertiesDefinition.propertypages[pageNo];
					//alert('properties for ' + JSON.stringify(page));
				    var result = bublForm.getFormDefinition(self, page);	
				
					self.propertiesDefinitionPage = result;	
					self.setupFontProperty();	
					self.setupStylesProperty();
					if(self.propertiesDefinitionPage.label === 'Interactions'){
						self.setupInteractions(result,
							function(result){
								callback(result);
							}
						)						
					} else {
						callback(result);
					}
				},
				
				menuItems: function(){
					var menuItems = [
						{ 'id': 'asset', 'label': 'Asset' },
						{ 'id': 'styling','label': 'Styling' },
						{ 'id': 'position','label': 'Position' },
						{ 'id': 'other','label': 'Other' }
					]
					return(menuItems);	
				},
				
				getPropertiesField: function(id){
					var self = this;
					var result = null;
					_.each(self.propertiesDefinitionPage.controls,
						function(field){
							if(field.id === id){
								result = field;
							}
						}
					);							
					return(result);
				},
					
				afterEdit: function(element){
					var self = this;
					var elementClass = self.params.elementClassName;
					var page = bublApp.variables['page'];
					var css = {};

					if(element.params.styles){
						css = {
							'padding-top': element.params.styles['padding-top'],
							'padding-left': element.params.styles['padding-left']
						}						
					}
					
					_.each(page.css['definition'],
						function(definition){
							if(definition.class.indexOf(elementClass) === 0 && definition.class.indexOf('.label') !== -1){
								definition['styles'] = css;
							}
						}
					);
					
					self.controlAfterEdit(element);
				},
				
				controlAfterEdit: function(element){
					
				},	
				
				propertiesDefinition: function(callback){
					// setup fonts
					var self = this;
					self.propertiesDefinition = propertiesDefinition;	
					self.setupFontProperty();	
					self.setupStylesProperty();
					self.setupInteractions(callback);	
				},

				setupFontProperty: function(){
					var self = this;
					var font = self.getPropertiesField('content.font');
					var options = []
					_.each(bublApp.variables['page']['css']['definition'],
						function(styleDefinition){
							if(styleDefinition['class'].indexOf('fontstyle') == 0){
								var color = 'White';
								if(styleDefinition['styles']['font-family'] === 'rgba(255,255,255)'){
									color = 'Black';
								}
								
								var label = styleDefinition['styles']['font-family'] + ' (' + styleDefinition['styles']['font-size'] + ') ' + color; 
								options.push(
									{
										'description': label,
										'value': styleDefinition['class']
									}
								)									
							}
						}
					)
					if(font !== null){
						font['options'] = options;
					}
				},
				
				setupStylesProperty: function(){
					var self = this;
					var style = self.getPropertiesField('content.style');
					
					if(style !== null){
						style['options'] = [
							{ 'description': 'No Style', 'value': 'no-style' },
							{ 'description': 'MS Blue', 'value': 'ms-blue' },
							{ 'description': 'MS Red', 'value': 'ms-red' },
							{ 'description': 'MS Dark Red', 'value': 'ms-dk-red' },
							{ 'description': 'MS Orange', 'value': 'ms-orange' },
							{ 'description': 'MS Purple', 'value': 'ms-purple' },
							{ 'description': 'MS Teal', 'value': 'ms-teal' },
							{ 'description': 'MS Green', 'value': 'ms-green' },
							{ 'description': 'MS Dark Purple', 'value': 'ms-dk-purple' },
							{ 'description': 'White', 'value': 'white' }
						]										
					}
				},

				setupInteractions: function(properties, callback){
					var self = this;
					
					ZEN.data.load('app/definitions/interactions.json', {},
						function(interactionsDefinition){
							var highlightActions = interactionsDefinition.controls[0];
							var highlightOptions = highlightActions.options;
							var activeActions = interactionsDefinition.controls[2];
							var activeOptions = activeActions.options;

							objectStore.getObject(bublApp.variables['bubl']['id'], 'withchildren',
								function(data){
									_.each(data.children,
										function(page){
											highlightOptions.push( { 
												'description': 'Goto - ' + page.title, 
												'value': 'showpage' + page.id 
											});		
											activeOptions.push( { 
												'description': 'Goto - ' + page.title, 
												'value': 'showpage' + page.id 
											});										
										}
									);								
									self.propertiesDefinitionPage.controls.push(highlightActions);
									self.propertiesDefinitionPage.controls.push(interactionsDefinition.controls[1]);
									self.propertiesDefinitionPage.controls.push(activeActions);
									self.propertiesDefinitionPage.controls.push(interactionsDefinition.controls[3]);
									callback(properties);
								}
							);
						}
					);		
				},
								
				getPropertyValue: function(setting, defaultValue){
					var result = defaultValue;
					ZEN.log('get property value ' + setting);
					try{
						result = setting;
					} catch(error) {
						
					}
					return(result);
				},
				
				resetClass: function(){
					//this.el.attr('class', '');	
				},
				
				getSetting: function(setting, defaultValue){
					var result = defaultValue;
					ZEN.log('get setting ' + setting);
					try{
						result = setting;
					} catch(error) {
						
					}
					return(result);
				},

				notify: function (message) {
					var self = this;
					message.source = this;

					ZEN.log('BublControl ' + message.type + ' ' + message.source.id);
					
					if (message.type === 'highlight') {
						this.el.addClass('hover');
                        var addControlType = bublApp.variables['addControlType'];
                        if(addControlType !== null && addControlType !== undefined){
                            this.addDropAreas();                        
                        }
					} else {
						this.el.removeClass('hover');
                        this.removeDropAreas();
					}
					self.addActionEvents(message);					
				},

				addActionEvents: function(message){
                    var self = this;
                    ZEN.notify ("ui.bublcontrol", message);
                    
					if(bublApp.displayMode === 'app'){
						if(message.type === 'active') {
							bublEditor.selectElementInEditor(self);
						}
					} else {
						if(this.params.actions !== undefined && this.params.actions.highlightAnimation !== undefined){
							if (message.type === 'highlight') {
								this.el.addClass(this.params.actions.highlightAnimation + ' animated');
							} else {
								this.el.removeClass(this.params.actions.highlightAnimation + ' animated');
							}
						}
						if(message.type === 'active'){
							if(this.params.actions.activeAction.startsWith('showpage')){
								var pageID = this.params.actions.activeAction.substr(8);
								bublApp.loadPlayerPage(pageID, this.params.actions.activeAnimation);
							}
							return(false);
						}
					}
				},
                
                addDropAreas: function(){
                    return;
                    var self = this;
                    self.el.css('position', 'relative');
                    self.hasDropTargets = true;
                    
                    var width = self.el.width();
                    var height = self.el.height();
                    
                    var width60 = Math.round(width * 0.6);
                    var height60 = Math.round(height * 0.6);
                    var width20 = Math.round((width - width60) / 2);
                    var height20 = Math.round((height - height60) / 2);

                    var top = height - height60;
                    var left = width - width60;
                    
                    self.dropTop  = $('<div id="dropTop" title="Add ?? above"/>')
                        .addClass('editorDropTarget')
                        .css(
                            {
                                'top': 0,
                                'left': width20,
                                'width': width60,
                                'height': height20                                                                
                            }
                        )
                        .appendTo(self.el);  
                    self.dropBottom  = $('<div id="dropBottom" title="Add ?? below"/>')
                        .addClass('editorDropTarget')
                        .css(
                            {
                                'width': width60,
                                'height': height20,
                                'bottom': 0,
                                'left': width20,
                            }
                        )
                        .appendTo(self.el);  
                    self.dropLeft  = $('<div id="dropLeft" title="Add ?? to the left"/>')
                        .addClass('editorDropTarget')
                        .css(
                            {
                                'width': width20,
                                'height': height60,
                                'top': height20,
                                'left': 0,
                            }
                        )
                        .appendTo(self.el);  
                    self.dropRight  = $('<div id="dropRight" title="Add ?? to the right"/>')
                        .addClass('editorDropTarget')
                        .css(
                            {
                                'width': width20,
                                'height': height60,
                                'top': height20,
                                'right': 0,
                            }
                        )
                        .appendTo(self.el);  
                    self.dropReplace  = $('<div id="dropReplace" title="Replace Element with ??"/>')
                        .addClass('editorDropTarget')
                        .css(
                            {
                                'width': width60,
                                'height': height60,
                                'top': height20,
                                'left': width20,
                            }
                        )
                        .appendTo(self.el);  
                },

                removeDropAreas: function(){
                    return;
                    var self = this;
                    if(self.hasDropTargets){
                        self.dropTop.remove();
                        self.dropBottom.remove();
                        self.dropLeft.remove();
                        self.dropRight.remove();
                        self.dropReplace.remove();                        
                    }
                    self.hasDropTargets = false;
                },
                                
   				getElement: function () {
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
						this.el.addClass('zen-contentarea');
						this.resize();

						this.setupStylingDiv();
						if(bublApp.displayMode === 'app'){
							this.el.css('cursor', 'pointer');
						} else {
							ZEN.log('in here');
							if(this.params.actions !== undefined){
								if(this.params.actions.activeAction !== undefined && this.params.actions.activeAction !== 'undefined'){
									this.el.css('cursor', 'pointer');
								}
							}
						}
                        //this.addDropAreas();
					}
					return this.el;
				},
                unpackStylingValues: function(){
                    var self = this;
                    var result = {}; 
                    _.each(self.params.styling,
                        function(value, key){
                            if(_.isObject(value)){
                                _.each(value,
                                    function(value2, key2){
                                        result[key + '-' + key2] = value2;
                                    }
                                )
                            } else {
                                result[key] = value;
                            }   
                        }
                    );
                    //alert(JSON.stringify(result, null, 4));
                    return(result);
                },				
				setupStylingDiv: function(){
					var self = this;
					
					this.imageLayer = $('<div class="bg-image" />');
					this.imageLayer.prependTo(this.el);						 
					this.colourLayer = $('<div class="bg-colour" />');
					this.colourLayer.prependTo(this.el);
                    if(self.params.content !== undefined && self.params.content !== null){
                        this.colourLayer.css(
                            {
                                'background-color': self.params.content.bgcolor
                            }                        
                        );                                                
                    }
					
					self.stylingDiv = $('<div class="styling"/>').appendTo(this.imageLayer);
                    					
					if(self.params.styling === undefined){
						self.params.styling = {};
					}
                    var css = self.unpackStylingValues();
                    //alert(JSON.stringify(css, null, 4));
                    self.stylingDiv.css(css);         
                    self.stylingDiv.css('border-color', css['border-color']);         
                    self.stylingDiv.css('border-style', 'solid');  
                    self.imageLayer.css('position', 'relative');
                    css = {
                            'position': 'absolute',
                            'top': bublUtil.safeNumber(css['margin-top']) + 'px',
                            'left': bublUtil.safeNumber(css['margin-left']) + 'px',
                            'bottom': bublUtil.safeNumber(css['margin-bottom']) + 'px',
                            'right': bublUtil.safeNumber(css['margin-right']) + 'px'
                        };
                    self.stylingDiv.css(css);
                    /*                   
                    var heightDifference = bublUtil.safeNumber(css['margin-top']) + bublUtil.safeNumber(css['margin-bottom']);               
                    var widthDifference = bublUtil.safeNumber(css['margin-left']) + bublUtil.safeNumber(css['margin-right']);
                    var dimensions = self.getDimensions();
                    var width = dimensions.width - widthDifference;
                    var height = dimensions.height - heightDifference;
                    
                    alert('w: ' + widthDifference + ', h: ' + heightDifference);
                    */               
					//self.params.styling = _.extend(self.params.styling, { 'width' : '100%', 'height': '100%' }, self.params.css);
                    //self.params.styling = _.extend(self.params.styling, self.params.css);
				},
				
				opacity: function (value) {
					if (value !== undefined) {
						this._opacity = value;
						//if(this.colourLayer !== null && this.colourLayer !== undefined){
						if(true){
							this.colourLayer.css('opacity',this._opacity);
						} else {
							alert('no color layer for ' + this.type)
						}
						return this;
					} else {
						return this._opacity;
					}
				},

				image: function (value) {
					if (value !== undefined) {
						this._image = value;
						//if(this.imageLayer !== null && this.imageLayer !== undefined){
						if(true){
							this.imageLayer.css({
								'background-image':'url('+this._image+')'
							});
						} else {
							alert('no image layer for ' + this.type)
						}
						return this;
					} else {
						return this._image;
					}
				},
								
				setupControlPropertiesForm: function(form, callback){
					callback();
					//alert('setup properties form ' + this.type + ' ' + JSON.stringify(form, null, 4));
				},
				
				getValue: function(source, defaultValue){
					var self = this;
					try{
						var sourceBits = source.split('.');
						var result = null;
						var level = self.params;
						
						if(sourceBits[0] === 'parent'){
							sourceBits.shift();
							level = self.parent.params;
						}
						
						for(var i=0; i < sourceBits.length; i++){
							var sourceBit = sourceBits[i];
							if(i === sourceBits.length -1){
								if(sourceBit.indexOf('[') !== -1){
									var tempSourceBit = sourceBit.substr(0, sourceBit.indexOf('[')); 
									var index = Number(sourceBit.substr(sourceBit.indexOf('[')).replace('[', '').replace(']', ''));
									var compoundValue = level[tempSourceBit];
									var levelBits = [null];
									if(compoundValue !== undefined && compoundValue !== null && _.isString(compoundValue)){
										levelBits = compoundValue.split(' ');
									}
									if(index < levelBits.length){
										result = levelBits[index];
									} else {
										result = null;
									}
								} else {
									result = level[sourceBit];
								}
							} else {
								if(level.hasOwnProperty(sourceBit)){
									level = level[sourceBit];
								} else {
									level[sourceBit] = {}
									level = level[sourceBit];
								}
							}
						}
						if(result === null){
							result = self.getPropertyValue(source);				
						}
						ZEN.log('get value "' + source + '" = "' + result + '"');			
					} catch(exception) {
						ZEN.log('get value error "' + source + '"  ("' + exception + ')');
						result = null;
					}
					
					if(result === null || result === undefined){
						result = defaultValue;
						ZEN.log('get value "' + source + '" = DEFAULT "' + result + '"');
					}
					return(result);
				},				
				
				setValue: function(source, value){
					var self = this;
					try{
						var sourceBits = source.split('.');
						var level = self.params;
						
						if(sourceBits[0] === 'parent'){
							sourceBits.shift();
							level = self.parent.params;
						}
						
						for(var i=0; i < sourceBits.length; i++){
							var sourceBit = sourceBits[i];
							if(i === sourceBits.length -1){
								if(sourceBit.indexOf('[') !== -1){
									var tempSourceBit = sourceBit.substr(0, sourceBit.indexOf('[')); 
									var index = Number(sourceBit.substr(sourceBit.indexOf('[')).replace('[', '').replace(']', ''));
									var compoundValue = level[tempSourceBit];
									var levelBits = [null];
									if(compoundValue !== undefined && compoundValue !== null && _.isString(compoundValue)){
										levelBits = compoundValue.split(' ');
									}
									if(index < levelBits.length){
										 levelBits[index] = value;
									}
								} else {
									level[sourceBit] = value;
								}
							} else {
								if(level.hasOwnProperty(sourceBit)){
									level = level[sourceBit];
								} else {
									level[sourceBit] = {}
									level = level[sourceBit];
								}
							}
						}
					} catch(exception) {
						ZEN.log('set value error "' + source + '"  ("' + exception + ')');
					}
				}								
			}
		);

		ZEN.registerType('BublControl',BublControl);

		return {
			BublControl: BublControl
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
