(function(window){
/*	Awesome todo

	-Get top bar to work
	-Get tabs working
	-sprite imgs
	-fix up front page
	-tidy up omnibar
	-fix resizer bug
	-Email coyier, explain your sitch

	top features:
	-develop spritely in spritely
		-ability to save projects
			-save's both offline and sync's with online.
		-seperate tabs that save to indexeddb (use framework w/ fallback)
		-in seperate window

	-new design
		-resizer: set ml to 0, width to 12px, give slight grey colour and resize elipses
	-spritely in spritely [x]
	-runtime errors for spritely
	-better omnibar, shows up all options at once

	-drag and drop a file/folder
	-sprite all imgs and preload
	-Fix tabs to use css, as opposed to fixed img 
		-http://codepen.io/ademilter/pen/wfAer
		-http://dabblet.com/gist/7068835
		-Also change colour theme back to proper monakai
	
	-alfred omni-bar
		-create seperate js file
		-file/tab search
	-search for options
	-be able to navigate without the mouse

	-resizer
		-localStorage
	-save spritelys
		-ability to update core spritely online, so you can always dev on it.
	-new design

	-codehint
	-tag matching
	
	-better startup load
	-live update for html and css
	-viewport stays same size when resizing horiz
	-when script is loaded, store reference and load it from the parent, replace iframe vers by accessing parent (get each load time under 20ms)
	-cdn js drop down or search
	-settings: code wrap
	
	-store last 10 iframe load times in array, when load time starts to get above 100ms, increase setTimeout
	Experimental feature later:
	-editor to dom mapping. Insane speed but not as reliable.
*/

Workspace.init();
Editor.init();
Tabs.init();
Project.init();
Viewport.init();

//purely to remember the resizer
var wid = localStorage['vpWidth'];
if(wid){
	Workspace.resizer.style.left = window.innerWidth - wid + 'px';
	Workspace.getCurrentViewport().cont.style.width = wid + 'px';
	Workspace.getCurrentEditor().cont.style.width = window.innerWidth - wid + 'px';
}
setTimeout(function(){
		editor.resize();
},100);

//Lets get the basics down first
//Spawn and editor and a viewport
//Then render a viewport


})(window, undefined);


/*
DONE:
-prototypal
-error msg for spritely coding, create Project.js
-better tab switching in sublime
-alfred omni: calculator

*/



/* 
Note: lookup OOJavascript.js for explanation of style & awesomeness
*/