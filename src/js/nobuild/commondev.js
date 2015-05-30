/*Execution timing*/if(typeof Tstart === 'undefined'){window.Tstart=(new Date).getTime()}
var gk ={};
if(~window.location.host.indexOf('localhost')  || window.location.host === "192.168.1.241" || window.location.host === "10.10.21.190" || window.location.host === "10.10.21.143"){
	(function(){
		
		//Click tester
		window.addEventListener('click', function(e){console.log('click', e.srcElement);}, false);

		if(document.addEventListener){
			document.addEventListener("DOMContentLoaded", function(e) {
				var a=(new Date).getTime();var b=a-window.Tstart;
				clog("DOMContentLoaded: "+ b + 'ms');
		  });
		}

		window.onload=function(){var a=(new Date).getTime();var b=a-window.Tstart;window.self === window.top ? clog('Page Load: ' + b + 'ms') : clog('frame load time: ' + b + 'ms')}
		//var node = document.createElement('div');node.innerHTML ='<span style="background-color:yellow;">Execution time: '+b+"ms</span>";if(document.body)document.body.appendChild(node);};

		window.onerror=function(a,b,c){
			var w = window;
			if(gk && !gk.generateError){
				gk.generateError = function generateError(){
					var e, d=w.document.createElement("div");d.className="gkErrorObj", lineNum=c;
					if(b) e=b.slice(b.indexOf("/")+2);

					//inception error
					if(window.self !== window.top){
						if(~navigator.userAgent.indexOf('Chrome') || ~navigator.userAgent.indexOf('Safari')){
							var scStr, sc;
							if(document.body && ~document.body.innerHTML.lastIndexOf('_$jshScriptCounter$_=')){
								scStr = document.body.innerHTML;
								sc = scStr.lastIndexOf('_$jshScriptCounter$_=');
								sc = scStr.indexOf('=', sc);
								sc = scStr.substring(sc+1, scStr.indexOf(';', sc));
								//do a search through and get all scripts
								lineNum = window.parent.Workspace.getCurrentProject()._arrScript[sc -1] + c-2;
							}
						}
						else if(~document.getElementsByTagName('head')[0].innerHTML.lastIndexOf('_$jshScriptCounter$_=')){
							
							scStr = document.getElementsByTagName('head')[0].innerHTML;
							sc = scStr.lastIndexOf('_$jshScriptCounter$_=');
							sc = scStr.indexOf('=', sc);
							sc = scStr.substring(sc+1, scStr.indexOf(';', sc));
							lineNum = window.parent.Workspace.getCurrentProject()._arrScript[sc -1] + c-2;
							//w.gk.addClass(w.$c('CodeMirror-gutter-text')[0].childNodes[lineNum-1],  'runtimeError');

						}
						else if(typeof(_$jshScriptCounter$_) !== 'undefined'){
							lineNum = window.parent.Workspace.getCurrentProject()._arrScript[_$jshScriptCounter$_ -1] + c-2;
							//w.gk.addClass(w.$c('CodeMirror-gutter-text')[0].childNodes[lineNum-1],  'runtimeError');
							//echo(document.body.innerHTML);
						}
						d.innerHTML = "<div style='z-index: 99999; position: fixed; bottom:0;width: 100%; font-family:Helvetica, calibri;background:pink; padding:0.4em 2.7% 0.8em 2.7%;border-top:1px #999 solid; position: fixed; bottom:0; width: 98%;'><div style='float:left;'>"+a+ "<br>Line: " + lineNum + "<br>Source File: "+"<a href='"+b+"'>"+e+"</a>" + "</div><span style=\" display: none; float:left; margin:15px 0px 0px 15px; background:red;padding:4px 9px;border-radius:30px; text-align:center; color:#FFF;\"></span></div>";
					}
					else{
						d.innerHTML="<div style='z-index: 99999; position: fixed; bottom:0;width: 100%; font-family:Helvetica, calibri;background:pink; padding:0.4em 2.7% 0.8em 2.7%;border-top:1px #999 solid;'><div style='float:left;'><strong>" + (/spritely/.test(window.location.href) ? "Spritely Core Error" : "Error" ) +"</strong><br>" + a + "<br>Line: "+ lineNum + "<br>Source File: "+"<a href='"+b+"'>"+e+"</a>"+"</div><span style=\" display: none; float:left; margin:15px 0px 0px 15px; background:red;padding:4px 9px;border-radius:30px; text-align:center; color:#FFF;\"></span></div>";	
					}
					w.$id('errorContainer').appendChild(d);
					w.gkErrorObj={a:a,b:b,c:c,d:1};
				}
			}
			if(!$id('errorContainer')){
				var div = w.document.createElement('div');div.id = 'errorContainer';
				w.document.body.appendChild(div);
			}
			//If there was no previous error
			if(typeof w.gkErrorObj == 'undefined'){
				gk.generateError();
			}
			//Check against last, if they are the same
			else if(a === w.gkErrorObj.a && b === w.gkErrorObj.b && c === w.gkErrorObj.c){
				var gkObj = w.$id('errorContainer').lastChild;
				var spanTag = gkObj.getElementsByTagName('span')[0];
				spanTag.innerHTML = ++w.gkErrorObj.d;
				spanTag.style.display = '';
			}
			else{
				gk.generateError();
			}
			if(w.Viewport){ gk.addClass(w.Viewport._errorContainer, "showI");}
			//gk.show(w.Viewport._errorContainer);
		};
	})();

	var echo = function echo(){
		var args, node = document.createElement('pre');
		function a(){
			document.body.appendChild(node);
		}
		if(arguments.length){
			if(typeof arguments[0] === 'object'){
				try{
				node.textContent = JSON.stringify(arguments[0], null, 4);
				}
				catch(e){
					node.textContent = arguments[0];
				}
			}
			else if (arguments.length ===1 && arguments[0]=== undefined){
				node.textContent = "undefined"
			}
			else node.textContent = Array.prototype.slice.call(arguments,0).join('');
		}
		else node.textContent = 'undefined';
		if(document.body) a();
		else gk.DOMready(a);
	}
};


//=== safe console ===//
var clog = (function(){if(window.console && ~window.location.host.indexOf("localhost") ) return function clog(val){console.log(val);};else return function clog(){};})();
var cwarn = (function(){if(window.console && ~window.location.host.indexOf("localhost") ) return function cwarn(val){console.warn(val);};else return function cwarn(){};})();
var cerr = (function(){if(window.console && ~window.location.host.indexOf("localhost") ) return function cerr(){console.error(Array.prototype.slice.call(arguments).join(' '));};else return function cerr(){};})();
function $id(id){return document.getElementById(id)}