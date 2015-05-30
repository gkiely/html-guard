//=== Editor ===//
// Spawns a new editor
// An editor instance contains all the tabs currently in that editor
// Handles all editor shortcuts

var Editor = (function(){
	function settings(){
		
	}
	return {
		cont: $id('editor'),
		_tabs:1,
		_theme: 'ace/theme/monokai',
		_mode: 'ace/mode/html',
		code: '',
		_id: 'editor',
		_size: '',
		inst:{},
		setCode: function(code){
			this.inst.setValue(code);
		},
		setCurs: function(curs){
			editor.session.selection.clearSelection();
			editor.moveCursorTo(curs.row, curs.col);
			editor.focus();
		},
		setTheme: function(val){
			this.inst.setTheme(val);
			this._theme = val;
		},
		init: function(){
			var str;
			window.editor = this.inst = ace.edit(this._id);
			this._settings();
			if(window.self === window.top){
				if(window.localStorage['code']){
					str = window.localStorage['code'];
					editor.setValue(str);
					editor.session.selection.clearSelection();
					var curs = gk.getLocalObj('curs');
					if(curs){
						editor.moveCursorTo(curs.row, curs.col);
					}
					
				}
				editor.focus();
				this.code = str;
			}
			this._addEventListeners();
			Workspace.setCurrentEditor(this);
			_q('#editor').add('<div class="whiteBlock" style="width: 15px; height: 15px; background: white; position: absolute; right: 0; z-index: 1000; bottom: 0;"></div>');
		}
	}
})();

Editor._settings = function(){
	this.inst.setTheme(this._theme);
	this.inst.session.setMode(this._mode);
	this.inst.session.setUseSoftTabs(false);
	//editor.session.setUseWrapMode(true);
	this.inst.setShowPrintMargin(false);
	this.inst.setHighlightActiveLine(false);
	this.inst.setBehavioursEnabled(false);
}

Editor._save = function(editor){
	var vp = Workspace.getCurrentViewport();
	this.code = editor.getValue();
	if(vp.visible()) vp.render(this.code);
	if(window.self === window.top){
		window.localStorage['code'] =  this.code;
		gk.saveLocalObj('curs', editor.getCursorPosition());
		window.localStorage['saved'] = true;
	}
};

Editor._dialog = function(){
	//either press save to save to root
	//or can click on folder and save in it
};

//Event listeners
Editor._addEventListeners = function(){
	var that = this;
	editor.commands.addCommand({
		name: "save",
		bindKey: {win: "Ctrl-S", mac: "Command-Option-S"},
		exec: function(editor){
			that._save(editor);
		}
	});
	editor.commands.addCommand({
		name: "ctrl-p",
		bindKey: {win: "Ctrl-P", mac: "Command-Option-P"},
		exec: function(editor){
			return false;
		}
	});

	var chTimer;
	//This can be improved so it only attaches onchange evt when needed.
	this.inst.on("change", function(){
		var vp = Workspace.getCurrentViewport();
		if(vp && vp.liveRender()){
			clearTimeout(chTimer);
			chTimer = setTimeout(function(){
				that._save(editor);
			},0);
		}
	});

	var curTimer;
	this.inst.on("changeSelection", function(){
		clearTimeout(curTimer);
		curTimer = setTimeout(function(){
			gk.saveLocalObj('curs', editor.getCursorPosition());
		}, 900);
	});


	//---
	//Scrollbar event listener
	// Adds a white box style fix at bottom of scrollbar
	// Also updates resizer based on whether scrollbar is present
	(function(){
		var res = $c('resizer');
		var whiteBlock;
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		var scr = $c('ace_scrollbar');

		setTimeout(function(){
			if(scr.style.display === 'none'){
				res.style.marginLeft = '-4px';
			}
		});
		

		if(MutationObserver){
			var observer = new MutationObserver(function(mutations, observer){
				var mutation = mutations[0];
				var val = mutation.target.getAttribute('style');
				whiteBlock = whiteBlock ||  _q('.whiteBlock');
				if(~val.indexOf('display: none')){
					whiteBlock.addClass('hide');
					res.style.marginLeft = '-4px';
				}
				else{
					whiteBlock.removeClass('hide');
					res.style.marginLeft = '-2px';
				}
			});

			var config = {
				attributes: true, 
				attributeFilter:["style"]
			};
			observer.observe(scr, config)
		}
	})();

	

		

	
	var runTimer, codeTimer;
	//auto update code
	this.inst.session.on('change', function() {
		that.code = editor.getValue();
		clearTimeout(runTimer);
		clearTimeout(codeTimer);
		runTimer = setTimeout(function(){
			if(window.self === window.top){
				Workspace.getCurrentViewport().render(that.code);
				codeTimer = setTimeout(function(){
		    		window.localStorage['code'] =  that.code;
		    		gk.saveLocalObj('curs', editor.getCursorPosition());
		    	}, 500)
	    	}
		},10);
	});
	
};