//$(function() {

	var bublApp = {
		variables: {},
		apiRoot: 'http://localhost:3000/api/objects',
		
		init: function(){
			var self = this;
			var url = 'http://localhost:3000/app.json'

			
			self.variables['username'] = 'Steve';
			self.variables['currentpage'] = 'bublselector';
			//self.variables['currentpage'] = 'assetUpload';
			

			url = ZEN.data.querystring['url'] === undefined ? url : ZEN.data.querystring['url'];
			self.setupObservers();
			self.load('app.json', null,
				function(parsedData){
					self.app = parsedData;

					self.loadPage(self.variables['currentpage']);
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
				}
			}
		},
		loadPage: function(page){
			var self = this;
			self.variables['lastpage'] = self.variables['currentpage'];
			self.variables['currentpage'] = page;
			$('body').empty();
			
			ZEN.log('load page');
			ZEN.log(self.variables);
			
			self.load('app/pages/' + page + '.json', null, 
				function(data){
					self.findID('ActivePage', self.app,
						function(element){
							element['children'] = [data];
							
							if(self.actions[page] && self.actions[page].onLoad){
								self.actions[page].onLoad(data, function(){
									self.preParse(element);

									ZEN.log('preparsed data');
									ZEN.log(self);
									
									if(ZEN.data.querystring['showjson'] == 'true'){
										document.write('<pre>' + JSON.stringify(self.app, null, 4) + '</pre>');		
									} else {
										
										ZEN.init(self.app);
										
										if(self.actions[page] && self.actions[page].afterLoad){
											self.actions[page].afterLoad(data,
												function(){
													
												}
											);
										}
								}
								});
							} else {
								self.preParse(element);

								ZEN.init(self.app);
							}
						}
					);
				}	
			);
			//$('body').empty();			
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
		preParse: function(data, defaults){
			var self = this;
			var childDefaults = {};
			$.extend(true, childDefaults, defaults);
						
			if(data['defaults']){
				$.extend(true, childDefaults, data['defaults']);
			}

			function runReplacer(data){
				for(item in data){
					// 	\$\(([abc]+)\)
					var value = data[item];
					if(_.isString(value)){
						data[item] = value.replace(/\$\(([a-z0-9A-Z]+)\)/g, function(a, b){
							if(self.variables[b]){
								ZEN.log('replace ' + b + ' = ' + self.variables[b]);
								return(self.variables[b]);
							} else {
								return('no variable - ' + b);
							}
						});
					}
					if(_.isObject(value)){
						runReplacer(value);
					}
				}
			}
			runReplacer(data);
			
			// process grids... this really isnt the place to put this..
			if(data['type'] == 'Grid'){
				var gridView =
					{
						'type': 'View',
						'layout': { 'style': 'vertical' },
						'children': []
					};
				var row = 0;
				var currentRow = null;
				var col = 0;
				
				_.each(data['children'],
					function(child){
						if(col === 0){
							// create new row
							currentRow = {
								'type': 'View',
								'layout': { 'style': 'horizontal' },
								'children': []								
							};
							gridView.children.push(currentRow);
						}	
						currentRow.children.push(child);
						col++;
						if(col === 3){
							col = 0;
						}
					}
				);
				data.children = [gridView];
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
									delete child['size'];
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
			
			/*
			self.setupObserver('ui.iconlabel',
				function(message){
					ZEN.log('observer(ui.iconlabel)', message, $(message.sourceElement));	
					self.executeAction(message.source.tag, message);	
				}
			);
			*/
			
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
		
		setCurrentBubl: function(bubl, callback){
			var self = this;
			if(_.isObject(bubl)){
				ZEN.log('set current bubl from object "' + bubl + '"');		
				self.variables['bubl'] = bubl;
				self.variables['bubltitle'] = bubl['title'];
				ZEN.log(self.variables);
				callback(bubl);				
			} else {
				ZEN.log('set current bubl from id "' + bubl + '"');		
				objectStore.getObject(bubl, null,
					function(bubl){
						ZEN.log(bubl);
						self.variables['bubl'] = bubl;
						self.variables['bubltitle'] = bubl['title'];
						ZEN.log(self.variables);
						callback(bubl);
					}	
				);	
			}
		}
	};
	
	//bublApp.init();	
//});
