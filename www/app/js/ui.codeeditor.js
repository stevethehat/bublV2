"use strict";

var ZEN = (function (ZEN, _, $) {
	ZEN.namespace('ui');
	_.extend(ZEN.ui, (function () {

		
		function CodeEditor (params, parent) {
			if (arguments.length > 0) {
				ZEN.ui.Control.call(this, params, parent);
			}
			return this;
		}

		CodeEditor.prototype = new ZEN.ui.Control();

		_.extend(
			CodeEditor.prototype,
			{

				init: function (params, parent) {
					// call the base class init method
					ZEN.ui.Control.prototype.init.call(this, params, parent);
				},

				label: function () {
				},

				notify: function (message) {
					message.source = this;

					ZEN.log(message.type);
					
					if (message.type === 'highlight') {
						this.el.addClass('hover');
					} else {
						this.el.removeClass('hover');
					}

					if(message.type === 'active') {
						ZEN.notify ("ui.CodeEditor", message);
					}
				},

				getElement: function () {
					var self = this;
					if (this.el === null) {
						ZEN.ui.Base.prototype.getElement.call(this);
		
						$('<div class="jsonEditor" id="' + this.el.attr('id') + 'editor" style="width:100%; height: 100%; font-family: Courier New, Courier, monospace"/>').text('this is the editor').appendTo(this.el);
						self.editor = ace.edit(this.el.attr('id') + 'editor');
						self.editor.setTheme('ace/theme/monokai');
						self.editor.getSession().setMode('ace/mode/javascript');
						this.resize();
					}
					return this.el;
				},

				setContent: function(content){
					var self = this;
					self.editor.setValue(content);
				},
				
				getContent: function(){
					var self = this;
					return(self.editor.getValue());
				}
			}
		);

		ZEN.registerType('CodeEditor', CodeEditor);

		return {
			CodeEditor: CodeEditor
		};
		

	}()));
	return ZEN;
}(ZEN || {}, _, $));
