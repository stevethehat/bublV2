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
		 'app/lib/ace/src/ace.js',
		 'app/js/bublApp.js',
		 'app/js/popup.js',
		 'app/js/objectstore.js',
		 'app/js/actions.js',
		 'app/js/ui.pagedgrid.js',
		 'app/js/ui.iconlabel.js',
		 'app/js/ui.thumbnailmenu.js',
		 'app/js/ui.codeeditor.js',
		 'app/js/ui.uploader.js'
		 ],
		function () {
			var url = 'app.json';

			url = ZEN.data.querystring['url'] === undefined ? url : ZEN.data.querystring['url'];
		
			bublApp.init();	
		}
	, false);

})(ZEN);
