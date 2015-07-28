/// <reference path="../../typings/jquery.d.ts"/>
//$(function() {

	var bublApp = {
		variables: {},
		apiRoot: 'http://localhost:3001/api/objects',
		
		init: function(){
			var self = this;
			var url = 'http://localhost:3001/app.json'

			
			self.variables['username'] = 'Steve';
			self.variables['currentpage'] = 'bublSelector';
			//self.variables['currentpage'] = 'assetUpload';
			

			url = ZEN.data.querystring['url'] === undefined ? url : ZEN.data.querystring['url'];
			self.setupObservers();
			self.load('app.json', null,
				function(parsedData){
					self.app = parsedData;
					ZEN.init(self.app);

					self.loadPage(self.variables['currentpage'], 'fadeIn');
				}	
			);
		},
		findID: function(id, data, callback){
			var self = this;
			if(data.id && data.id === id){
				ZEN.log('found ID');
				callback(data);
			} else {
				if(data.children){
					_.each(data.children,
						function(element){
							self.findID(id, element, callback);
						}
					);
				} else {
					if(_.isObject(data)){
						for(var oName in data){
							self.findID(id, data[oName], callback);
						}
					}
				}
			}
		},
		loadPage: function(pageName, inAnimation, outAnimation){
			var self = this;
		
			self.variables['lastpage'] = self.variables['currentpage'];
			self.variables['currentpage'] = pageName;
			//$('body').empty();
			
			ZEN.log('load page');
			ZEN.log(self.variables);
			
			self.load('app/pages/' + pageName + '.json', null, 
				function(data){
					var newPage = self.setDefaults(data);
					
					if(self.actions[pageName] && self.actions[pageName].onLoad){
						self.actions[pageName].onLoad(data, function(){
							self.showPage(newPage, pageName, data, inAnimation, outAnimation);
						});
					} else {
						self.showPage(newPage, pageName, data, inAnimation, outAnimation);
					}
				}	
			);
		},
		
		setDefaults: function(data){
			var newPage = {};
			newPage['BublApp'] = {
				'after': 'toolbar',
				'type': 'View',
				"size": { "width": "full", "height": "full" },
				"layout": { "style": "vertical", "align": "left" }, 
				defaults: { 
					"type": "View",
					"show": true,
					"size": { "width": "max", "height": "max" },
					"layout": { "style": "vertical", "align": "left" } 
				},
				children: data['BublApp'].children
			}
			newPage['toolbarButtons'] = data['toolbarButtons'];
			/*
			newPage['toolbarButtons'] = {
				'type': 'View',
				'children':[]
			}*/
			return newPage;			
		},

		load: function(url, parent, callback){
			var self = this;
			ZEN.data.load(
				url, {},
				function (data) {
					var parsedData = self.preParse(data, {});
					
					if(callback !== undefined){
						callback(parsedData);
					}
				}
			);
		},

		lastElements: {},
		showPage: function(newDefinition, pageName, data, inAnimation, outAnimation){
			var self = this;
			this.lastElements['BublApp'] = self.showElement('BublApp', newDefinition['BublApp'], inAnimation, outAnimation);
			if(newDefinition['toolbarButtons'] !== undefined){	
				this.lastElements['toolbarButtons'] = self.showElement('toolbarButtons', newDefinition['toolbarButtons'], 'fadeIn', 'fadeOut');
			} else {
				var empty = {
					'type': 'View',
					'children': []
				}
				this.lastElements['toolbarButtons'] = self.showElement('toolbarButtons',  empty, 'fadeIn', 'fadeOut');
			}
			self.dump('main', ZEN.objects['BublApp'].serialize());

			if(self.actions[pageName] && self.actions[pageName].afterLoad){
				self.actions[pageName].afterLoad(data,
					function(){}
				);
			}
		},

		showElement: function(parentID, newDefinition, inAnimation, outAnimation){
			inAnimation = 'fadeIn';
			outAnimation = 'fadeOut';
			var self = this, o, cleanup;
			//alert(JSON.stringify(newDefinition));
			var parsedData = self.preParse(newDefinition);
			//alert(JSON.stringify(parsedData));
			self.dump(parentID, parsedData);

			o = ZEN.parse(parsedData, ZEN.objects[parentID]);

			if (self.lastElements.hasOwnProperty(parentID)) {
				cleanup = self.lastElements[parentID];
				self.lastElements[parentID].animate(outAnimation, false,
					function () {
						ZEN.cleanup();
						cleanup.remove();
					}
				);
			}

			ZEN.objects[parentID].resize(true);
			if(o){
				o.animate(inAnimation, true,
					function(){}
				);
			}
			return o;
		},
		
		runReplacer: function(data){
			var self = this;
			function getVariable(key){
				var value = null;
				var keys = key.split('.');
				
				if(keys.length === 1){
					value = self.variables[keys[0]];
				} else {
					var level = null;
					_.each(keys,
						function(levelKey){
							if(level === null){
								level = self.variables[levelKey];
							} else {
								level = level[levelKey];
							}
						}	
					);
					value = level;
				}
				ZEN.log('getVariable ' + key + ' = ' + value);
				return(value);
			}
			for(var item in data){
				// 	\$\(([abc]+)\)
				var value = data[item];
				if(_.isString(value)){
					data[item] = value.replace(/\$\(([a-z0-9A-Z.]+)\)/g, function(a, b){
						var result = getVariable(b);
						if(result === null){
							result = 'no variable ' + b;
						} else {
							ZEN.log('replace ' + b + ' = ' + result);
						}
						return(result);
					});
				}
				if(_.isObject(value)){
					self.runReplacer(value);
				}
			}
		},
		
		preParse: function(data, defaults){
			var self = this;
			var childDefaults = {};
			$.extend(true, childDefaults, defaults);
						
			if(data['defaults']){
				$.extend(true, childDefaults, data['defaults']);
			}

			self.runReplacer(data);
			
			// process grids... this really isnt the place to put this..
			if(data['type'] == 'Grid'){
				data.children = ZEN.ui.Grid.preProcess(data);
			}
			
			if(data['children']){
				// check that if there is more than one child that is not a view & if there is.. wrap them all
				var children = data['children'];
				
				if(data['type'] === 'View' && children.length > 1){
					var wrapChildren = false;
					for(var i = 0; i < children.length; i++){
						var child = children[i];
						var childType = child['type'];
						if(childType === undefined){
							childType = childDefaults['type']
						}
						if(String(childType) !== String('View')){
							wrapChildren = true;
							break;
						}
					}
					
					if(wrapChildren){
						var viewWrappedChildren = [];
						for(var i = 0; i < children.length; i++){
							var child = children[i];
							if(child.type !== 'View'){
								var wrapperView = {
									'type': 'View',
									'autoadded': true,
									'children': [child]
								};
								if(child['size']){
									wrapperView['size'] = child['size'];
									//delete child['size'];
									child['size'] = { 'width': 'max', 'height': 'max' };
								}
								if(child['id']){
									wrapperView['id'] = child['id'] + 'AutoWrap';
								}
								viewWrappedChildren.push(wrapperView);
							} else {
								viewWrappedChildren.push(child);
							}
						}
						data['children'] = viewWrappedChildren;
						children = viewWrappedChildren;
					}	
				}
				for(var i = 0; i < children.length; i++){
					children[i] = $.extend(true, {}, childDefaults, children[i]);
					self.preParse(children[i], childDefaults);
				}
			}
			return(data);
		},
		
		setupObserver: function(queue, callback){
			ZEN.observe(queue, null, {},
				function (params) {
					callback(params);
				}
			);
		},
		
		setupObservers: function(){
			var self = this;
			
			self.setupObserver('ui.button',
				function(message){
					ZEN.log('observer(ui.button)', message, $(message.sourceElement));	
					self.executeAction(message.source.tag, message);	
				}
			);
			
			self.setupObserver('pageevents',
				function(params){
					if(params.event === 'imageloaded'){
										
					}
				}	
			);	
		},
		
		executeAction: function(actionName, message){
			var self = this;
			ZEN.log('executeAction ' + actionName, message);

			var action = null;
			var sourceElement = $(message.sourceElement);
			
			// check if we have a page specific action
			if(self.actions[self.variables.currentpage][actionName]){
				action = self.actions[self.variables.currentpage][actionName]; 								
			} else if (self.actions['default'][actionName]){
				action = self.actions['default'][actionName]; 								
			}
			
			if(action !== null){
				action(message.source, sourceElement);
			} else {
				ZEN.log(actionName + ' not found');
			}			
		},
		
		setCurrentObject: function(keys, object, callback){
			var self = this;
			
			function setObjectForKeys(object){
				_.each(keys,
					function(key){
						ZEN.log('set object for key "' + key + '"', object);
						self.variables[key] = object;	
					}
				);
				callback(object);				
			}
			
			if(_.isObject(object)){
				setObjectForKeys(object);
				/*
				ZEN.log('set current object from object "' + object + '"');		
				self.variables['bubl'] = object;
				self.variables['bubltitle'] = object['title'];
				*/
			} else {
				objectStore.getObject(object, null,
					function(object){
						setObjectForKeys(object);
						/*		
						self.variables['bubl'] = object;
						self.variables['bubltitle'] = object['title'];
						ZEN.log(self.variables);
						callback(object);
						*/
					}	
				);	
			}
		},
		
		dump: function(fileName, object){
   			$.ajax({
        		url: 'api/dump/' + fileName,
        		type: 'POST',
        		contentType: 'application/json',
        		data: JSON.stringify(object),
        		dataType: 'json',
				success: function(returnData){}
			});

		}
	};
	
	//bublApp.init();	
//});
