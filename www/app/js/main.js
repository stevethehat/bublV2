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
		 'app/js/ui.asset.js',
		 'zen/js/ui.menu.js',
		 'zen/js/ui.list.js',
		 'zen/js/ui.layoutcontrol.js',

		 'app/js/ui.formselect.js',
		 'app/js/ui.formedit.js',
		 'app/js/ui.formcheck.js',
		 'app/js/ui.formcolor.js',
		 'app/js/ui.formdatalist.js',
		 'app/js/ui.formrange.js',
		 'app/js/ui.formnumber.js',
		 'app/js/ui.formslideselector.js',

		 'app/lib/color-thief.js',
		 'app/lib/ace/src/ace.js',
		 'app/js/bublApp.js',
		 'app/js/bublAssets.js',
		 'app/js/bublEditor.js',
		 'app/js/bublUtil.js',
		 'app/js/bublForm.js',
		 'app/js/popup.js',
		 'app/js/objectstore.js',
		 'app/js/actions.js',
		 'app/js/ui.pagedgrid.js',
		 'app/js/ui.iconlabel.js',
		 'app/js/ui.thumbnailmenu.js',
		 'app/js/ui.codeeditor.js',
		 'app/js/ui.uploader.js',
		 'app/js/ui.bublcontrol.js',
		 'app/js/ui.contentarea.js',
		 'app/js/ui.contenteditable.js',
		 'app/js/ui.compoundelement.js',
		 'app/js/ui.bublimage.js',
		 'app/js/ui.bublvideo.js',
		 'app/js/ui.bublcolumns.js',
		 'app/js/ui.bublrows.js',
		 
		 'app/js/ui.bublview.js',
		 'app/js/ui.bublslides.js',
		 'app/js/ui.msMenuBox.js'
		 
		 ],
		function () {
			var url = 'app.json';

			url = ZEN.data.querystring['url'] === undefined ? url : ZEN.data.querystring['url'];
		
			bublApp.init();	
		}
	, false);

})(ZEN);
