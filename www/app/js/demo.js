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
		 'app/js/ui.msMenuBox.js',
		 
		 'app/js/ui.bublview.js',
		 'app/js/ui.bublslides.js',
		 'app/js/ui.bublcss.js'
		 
		 ],
		function () {
			function getUrlVars(){
				var vars = [], hash;
				var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
				for(var i = 0; i < hashes.length; i++)
				{
					hash = hashes[i].split('=');
					vars.push(hash[0]);
					vars[hash[0]] = hash[1];
				}
				return vars;
			}
			var urlVars = getUrlVars();
			var bubl = urlVars['bubl'];
			var page = urlVars['page'];
			var url = 'v2definitions/demoexample' + bubl + '_' + page + '.json';
			var css_url = 'app/css/demoexample' + bubl + '_' + page + '.css'
			
	        $('head').append('<link rel="stylesheet" href="' + css_url + '" type="text/css" />');
			
			ZEN.data.load(
				url, {},
				function (data) {
					ZEN.init(data);
				}
			);
		}
	, false);

})(ZEN);
