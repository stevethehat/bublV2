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
				}
			}
		},
		loadPage: function(page, inAnimation, outAnimation){
			var self = this;
		
			self.variables['lastpage'] = self.variables['currentpage'];
			self.variables['currentpage'] = page;
			//$('body').empty();
			
			ZEN.log('load page');
			ZEN.log(self.variables);
			
			self.load('app/pages/' + page + '.json', null, 
				function(data){
					var defaults = 	{ 
						"type": "View",
						"show": true,
						"size": { "width": "max", "height": "max" },
						"layout": { "style": "vertical", "align": "left" } 
					};
					
					var newPage = {
						'after': 'toolbar',
						'type': 'View',
						"size": { "width": "full", "height": "full" },
						"layout": { "style": "vertical", "align": "left" }, 
						defaults: defaults,
						children: data.children
					}
					
					if(self.actions[page] && self.actions[page].onLoad){
						self.actions[page].onLoad(data, function(){
							self.showPage(newPage, page, data, inAnimation, outAnimation);
						});
					} else {
						self.showPage(newPage, page, data, inAnimation, outAnimation);
					}
				}	
			);
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

		lastPage: null,
		showPage: function(newPage, page, data, inAnimation, outAnimation){
			var self = this, o;
			self.preParse(newPage);
			var parsedData = self.preParse(newPage);	

			o = ZEN.parse(parsedData, ZEN.objects['BublApp']);

			ZEN.log('we have done the resize!!!');
			self.dump(ZEN.objects['BublApp'].params);				

			//activePage.replaceChildren(parsedData.children);;
			if (self.lastPage !== null) {
				self.lastPage.animate(outAnimation, false,
					function () {
						ZEN.log('out animation done!!');
						ZEN.cleanup();
					}
				);
			}

			ZEN.objects['BublApp'].resize(true);
//			o.show(true);

			o.animate(inAnimation, true,
				function(){
					//ZEN.objects['BublApp'].resize(true);
				}
			);
			this.lastPage = o;
			if(self.actions[page] && self.actions[page].afterLoad){
				self.actions[page].afterLoad(data,
					function(){
						
					}
				);
			}
		},
		
		runReplacer: function(data){
			var self = this;
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
			
			if(data.type === 'Application'){
				alert('at root level');
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
		},
		
		dump: function(object){
   			$.ajax({
        		url: 'api/dump',
        		type: 'POST',
        		contentType: 'application/json',
        		data: JSON.stringify(object),
        		dataType: 'json',
				success: function(returnData){
					ZEN.log('returned data');
					ZEN.log(returnData);
				}
			});

		}
	};
	
	//bublApp.init();	
//});
