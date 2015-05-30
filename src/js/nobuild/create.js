// =================================================
// Name: Create JS
// Details: a small library that extracts the menial tasks out of OO programming in JavaScript 
// and also adds some extra functionality that you would have to hand-roll with new/Object.create/es6 classes.
// Version: 0.9
// Author: Grant Kiely
// =====================

// Todo...
// Create inheritance for all createClass methods, if you create a method that also has a parent method of the same name
// it will get converted to an array and both will get called by default.
// clean up, make functions modular & nice, comment, maybe start from scratch and do a rewrite

var create = (function(){

	// ================
	// Internal Methods
	// ================
	// ===========================================================
	// Copies properties of passed in object to child object
	// @params:  child -> child object, obj -> object passed to create()
	// @return: no return needed as Object.create is pbr
	// ===========================================================
	function addProps(child, obj){
		for(var i in obj){
			child[i] = obj[i];
		}
	}

	// ===================================
	// Overwrites and adds required params
	// @params: child -> child object, req -> required params in object, obj -> object passed to create()
	// @return: no return
	// ==================
	function addReqs(child, req, obj){
		if(obj.req){
			child.req = obj.req;
		}
		else if(req){
			child.req = obj.__req || {};
			for(var i in req){
				child.req[i] = req[i];
			} 
		}
	}

	// ====================================================================
	// Checks requirement object, and throws error if property not present.
	// @params: obj -> object passed to create() these are the props we are checking, 
	// req -> req object to test against, parent -> parent object
	// @return: no return
	// ==================
	function checkReq(obj, req, parent){
		var err = [], typeStr,
			name = parent._name;

		for(var i in req){
			if(obj && obj.hasOwnProperty(i)){
				typeVal = typeof req[i];
				if(typeVal === 'function'){
					if( !req[i](obj[i]) ) {
						throw new Error ('parameter: ['+ i + '] did not meed param requirements');
					}
				}
				else if(typeVal === 'object' && Object.keys(req[i]).length){
					//This currently only allows 1 test & msg, can update for more in future
					if( req[i].test && !req[i].test( obj[i] ) ){ 
						throw new Error ('parameter: ['+ i + '] ' + req[i].msg( obj[i] )  || 'did not meed param requirements' );
					}
				}
			}
			else if( !parent.hasOwnProperty(i) ){
				err.push(i);
			}
		}
		if(err.length) {
			throw new Error(name  +' instance missing parameter' + (err.length > 1 ? 's' : '') + ': ' + err.join(', ') );
		}
	}

	// ===========================================================================================
	// Get's all properties that aren't functions, have the name of req, or start with _ (private)
	// Useful for testing req's, note: you can't req functions
	// @params: parent -> parent object
	// @return: object with filtered properties
	// ========================================
	function getFilteredProps(parent){
		var obj={};
		for(var i in parent){
			if(typeof parent[i] !== "function" && i !== "req" && i.charAt(0) !== "_"){
				obj[i] = parent[i];
			}
		}
		return obj;
	}



	// ==========
	// Public API
	// ==========
	// =============================
	// Public wrapper for createClass
	// Checks for function, if name, adds reference to it, calls create without init.
	// @param: parent -> parent object (optional for inheritance)
	// @param: func -> can pass function or {}, added benefit to function is the name prop, you can query inherited parent.
	// @return: new class object that other objects can inherit from
	// =============================================================
	window.createClass = function createClass(parent, func){
		var name = parent.name, obj;
		if(typeof parent === "function"){
			parent = parent();
			if(name){
				parent._name = name;
			}
			return parent;
		}
		if(typeof func === "function"){
			name = func.name;
			obj = func() || {};
			obj._name = name;
			obj._parent = parent._name;
		}
		else if (typeof func === "object"){

		}
		else{
			return parent;
		}
		obj = obj || func;
		return create(parent, obj, false);
	};


	// ====================
	// Main create function
	// Creates new object from existing
	// Utilises Object.create, auto calls init(), check's required params
	// @params: parent -> parent object, obj -> passed in object, init -> bool flag to call init/check req's
	// @return: new object
	// ===================
	return function create(parent, obj, init){
		var child = Object.create(parent),
				req = obj.req || parent.req;

		if(obj){
			addProps(child, obj);
			addReqs(child, req, obj);
		}
		if(init !== false){
			// If object do normal checkReq
			if(typeof child.req === "object") checkReq(obj, child.req, parent);
			// If string get do full check, does not include vars prefixed with _
			else if(typeof child.req === "string" && child.req.toLowerCase() === "all"){
				var tempObj = getFilteredProps(parent);
				checkReq(obj, tempObj, parent);
			}
		}

		
		//Inheritance of init
		if(typeof child.init === "function" && init !== false){
			child.init();
		}
		else if(typeof child.init === "object" && parent.init.length !== undefined && init !== false){
			child.init.forEach(function(f){
				f();
			});
		}
		else if(typeof child.init === "object" && child.init.length !== undefined){}
		else if(typeof parent.init === "object" && parent.init.length !== undefined){
			var temp = [];
			temp = parent.init.slice(0);
			temp.push(child.init);
			child.init = temp;
		}
		else if(typeof parent.init === "function" && child.init){
			if(typeof child.init === "function"){
				child.init = [parent.init, child.init];
			}
		}

		return child;
	}
})();


// ======================
// Object.create Polyfill
// ======================
if(typeof Object.create!='function'){(function(){var F=function(){};Object.create=function(o){if(arguments.length > 1){throw Error('Second argument not supported');}if(typeof o != 'object'){throw TypeError('Argument must be an object');}F.prototype = o;return new F();};})();}

// ======================
// Array.forEach Polyfill
// ======================
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if(!Array.prototype.forEach){Array.prototype.forEach=function(e,t){var n,r;if(this==null){throw new TypeError(" this is null or not defined")}var i=Object(this);var s=i.length>>>0;if(typeof e!=="function"){throw new TypeError(e+" is not a function")}if(arguments.length>1){n=t}r=0;while(r<s){var o;if(r in i){o=i[r];e.call(n,o,r,i)}r++}}}