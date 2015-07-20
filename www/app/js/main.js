"use strict";

(function (ZEN) {

	ZEN.require(
		['zen/js/events.js',
		 'zen/js/data.js',
		 'zen/js/ui.base.js',
		 'zen/js/ui.view.js',
		 'zen/js/ui.control.js',
		 'zen/js/ui.textpanel.js',
		 'zen/js/ui.slider.js',
		 'zen/js/ui.button.js',
		 'zen/js/ui.menu.js',
		 'app/lib/color-thief.js',
		 'app/js/bubl.js',
		 'app/js/objectstore.js',
		 'app/js/actions.js',
		 'app/js/ui.grid.js',
		 'app/js/ui.thumbnailmenu.js',
		 'app/js/ui.codeeditor.js',
		 'app/js/ui.uploader.js'
		 ],
		function () {
			var url = 'app.json';

			url = ZEN.data.querystring['url'] === undefined ? url : ZEN.data.querystring['url'];
		
			bublApp.init();	

			/*			
			ZEN.data.load(
				url, {},
				function (data) {
					ZEN.init(data);

					ZEN.observe(
						"ui.button", // this is the message queue identifier
						{source: ["test-button"]}, // this is the source object/objects
						// null,
						function (message) {
							if(message.type === 'active') {
								// ZEN.objects['debug-view'].setSize({width: 400});
								// ZEN.objects['debug-view'].parent.resizeChildren(true);
								ZEN.objects['resize-view'].setSize({width: 250});
								ZEN.objects['resize-view'].parent.resizeChildren(true);
							}
						}
					);

					
					ZEN.observe(
						"ui.button",
						{source: ["alien", "big-button"]},
						function (message) {
							if(message.type === 'active') {
								if (message.source.id === 'alien') {
									// ZEN.objects['page1'].animate('bounceOutDown',false, function () {
									// 	ZEN.objects['page2'].animate('bounceInDown',true);
									// });
									ZEN.objects['page1'].animate('slideOutDown',false);
									ZEN.objects['page2'].animate('slideInDown',true);

								} else {
									// ZEN.objects['page2'].animate('bounceOutUp',false, function () {
									// 	ZEN.objects['page1'].animate('bounceInUp',true);
									// });

									ZEN.objects['page2'].animate('bounceOutUp',false);
									setTimeout(function () {
										ZEN.objects['page1'].animate('bounceInUp',true);
									}, 250);

								}
							}
						}
					);
					
					

					ZEN.observe(
						"ui.slider",
						null,
						function (message) {
							var o;
							o = message.source;
						}
					);
					
				}
			);
			*/
		}
	);

})(ZEN);
