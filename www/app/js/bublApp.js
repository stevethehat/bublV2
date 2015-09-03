/// <reference path="../../typings/jquery.d.ts"/>
//$(function() {

	var bublApp = {
		variables: {},
		apiRoot: 'http://localhost:3001/api/objects',
		
		init: function(){
			var self = this;
			var url = 'http://localhost:3001/app.json'

			
			self.variables['username'] = 'Steve';
			self.variables['currentpage'] = 'home';
			
			var id = ZEN.data.querystring['id'];
			if(id === undefined){
				self.displayMode = 'app';
				self.initApp();			
			} else {
				self.displayMode = 'player';
				self.initPlayer(id);
			}
		},
		
		initApp: function(){
			var self = this;
			self.setupObservers();
			self.load('app.json', null,
				function(parsedData){
					self.app = parsedData;
					ZEN.init(self.app);

					self.loadPage(self.variables['currentpage'], 'fadeIn');
				}	
			);			
		},
		
		initPlayer: function(id){
			var self = this;
			var base = {
				'type': 'Application',
				'id': 'BublApp',
				'show': true,
				'children':[
					{
						'type': 'View',
						'id': 'bublPlayer',
						'size': { 'width': 'max', 'height': 'max' },
						'layout': { 'style': 'vertical', 'align': 'left' },
						'children': []
					}	
				],
				'defaults': { 
					'type': 'View',
					'show': true,
					'size': { 'width': 'max', 'height': 'max' },
					'layout': { 'style': 'vertical', 'align': 'left' }
				}
			}
			ZEN.init(base);
			self.loadPlayerPage(id, 'fadeIn');
		},
		
		loadPlayerPage: function(id, inAnimate){
			var self = this;
			
			if(inAnimate === undefined || inAnimate === null || inAnimate === ''){
				inAnimate = 'fadeIn';
			}
						
			objectStore.getObject(id, null,
				function(object){
					/*
					if(object.type === 'template'){
						base = self.preParse(base, {});
					}
					*/
					//var inAnimate = 'bounceInDown';
					//var outAnimate = 'bounceOutDown';
					
					var currentPageId = bublApp.variables['currentPlayerPageID'];
					
					ZEN.log('load page ' + id + ' from ' + currentPageId);
					
					var currentPage = ZEN.objects['BublPageRoot'];
					if(currentPageId === id){
						// dont load it twice
						ZEN.log('DONT DO IT TWICE!!!!');
						return;
					}
					object.layout.size['width'] = 'full';
					object.layout.size['height'] = 'full';
					var playerPage = ZEN.parse(object.layout, ZEN.objects['bublPlayer']);

					if(currentPage !== undefined){
						ZEN.log('do OUT Animate');
						//currentPage.animate(outAnimate, false,
						//	function () {
								/*
								ZEN.cleanup();
								currentPage.remove();
								*/
						//	}
						//);
					} else {
						
					}
					bublApp.variables['currentPlayerPageID'] = id;
					ZEN.objects['bublPlayer'].resize();					
					ZEN.objects['bublPlayer'].show(true);
					
					ZEN.log('do IN Animate');
					playerPage.animate(inAnimate, true, 
						function(){
							currentPage.remove();
							ZEN.cleanup();
						}	
					);
					/*
					if(currentPage !== undefined){
						ZEN.log('do IN Animate');
						playerPage.animate(inAnimate, true, 
							function(){
								currentPage.remove();
								ZEN.cleanup();
							}	
						);
					}
					*/
				}
			);
		},

		loadPage: function(pageName, inAnimation, outAnimation){
			var self = this;
		
			self.variables['lastpage'] = self.variables['currentpage'];
			
			if(pageName !== self.variables['currentpage']){
				delete bublApp.variables['gridnumpages']
				delete bublApp.variables['gridcurrentpage']
			}
			self.variables['currentpage'] = pageName;
			//$('body').empty();
			
			ZEN.log('load page "' + pageName + '"');
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
				"title": data['BublApp']['title'],
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
			self.variables['lastPageTitle'] = self.variables['currentPageTitle'];
			self.variables['currentPageTitle'] = newDefinition['BublApp']['title'];
						
			if(self.variables['lastPageTitle'] !== undefined){
				$('#backButton').attr('title', 'back to \'' + self.variables['lastPageTitle'] + '\'');
				$('#backButton').css('display', 'block');
			} else {
				$('#backButton').css('display', 'none');
			}
			
			$('#Header .label h1').text('bubl (' + pageName + ')');
			
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
			var parsedData = self.preParse(newDefinition);
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
				try{
					o.animate(inAnimation, true,
						function(){}
					);				
				} catch (e){
					ZEN.log('NO animate on ', o);
				}
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
								if(level && level.hasOwnProperty(levelKey)){
									level = level[levelKey];								
								} else {
									level = 'unknown variable ' + levelKey;
								}
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
			if(data['type'] == 'PagedGrid'){
				data.children = ZEN.ui.PagedGrid.preProcess(data);
			}
			
			if(data['children']){
				// check that if there is more than one child that is not a view & if there is.. wrap them all
				var children = data['children'];
				
				if((data['type'] === 'View' || data['type'] === 'BublView') && children.length > 1){
					var wrapChildren = false;
					for(var i = 0; i < children.length; i++){
						var child = children[i];
						var childType = child['type'];
						if(childType === undefined){
							childType = childDefaults['type']
						}
						if(String(childType) !== String('View') || String(childType) !== String('BublView')){
							wrapChildren = true;
							break;
						}
					}
					
					if(wrapChildren){
						var viewWrappedChildren = [];
						for(var i = 0; i < children.length; i++){
							var child = children[i];
							if(child.type !== 'View' && child.type !== 'BublView'){
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
			
			bublEditor.setupObservers();
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
			var currentPage = self.actions[self.variables.currentpage]; 
			
			// check if we have a page specific action
			if(currentPage[actionName]){
				action = self.actions[self.variables.currentpage][actionName]; 								
			} else if (self.actions['default'][actionName]){
				action = self.actions['default'][actionName]; 								
			}
			
			if(action !== null){
				action(message.source, sourceElement);
			} else {
				ZEN.log(actionName + ' not found for ' + currentPage);
			}			
		},
		
		setCurrentObject: function(keys, object, callback){
			var self = this;
			
			function setObjectForKeys(object){
				_.each(keys,
					function(key){
						ZEN.log('set object for key "' + key + '"', object);
						self.variables[key] = object;	
						ZEN.log('variables = ', self.variables);
					}
				);
				callback(object);				
			}
			
			if(_.isObject(object)){
				setObjectForKeys(object);
			} else {
				objectStore.getObject(object, null,
					function(object){
						setObjectForKeys(object);
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
		},
		
		getBublID: function(elementID){
			return(elementID.substr(4));
		}
	};
	
	//bublApp.init();	
//});
