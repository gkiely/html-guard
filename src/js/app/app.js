;(function(){
"use strict";




if(window.$){
	var $doc = $(document),
			$win = $(window),
			$body = $(document.body);
}



// Class Example code
// ========

// class Human {
// 	constructor(inst){
// 		setPropsAndInit(this, inst);	
// 	}
// }

// let x = new Human({
// 	name: 'grant',
// 	age: 24,
// 	init: function(){
// 	  echo('yolo');
// 	}
// });



// =======
// Angular
// =======
var app = angular.module('app', ['ngRoute']);


/**
 * Router
 */
app.config(function($routeProvider, $locationProvider){
	// $locationProvider.hashPrefix('!');
	// $locationProvider.html5Mode(true);
	function setUrl(args){
	  return args.pageName + '.html';
	}

	$routeProvider
	.when('/', {
		templateUrl: 'creative.html'
	})
	.when('/banner-upload',{
		rootScopeData:{
			title: 'Creative'
		},
		templateUrl: 'banner-upload.html',
		// requireLogin: true
	})
	.when('/banner-upload-client', {
		data:{
			client: true
		},
		templateUrl: 'banner-upload.html'
	})
	.when('/:pageName', {
		templateUrl: setUrl
	})
});


/**
 * Filters
 */

app.filter('capitalize', function() {
  return function(input, all) {
    return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
  }
});

/**
 * Directives
 */
app.directive('verticalAlign', function(){
  return {
  	restrict: "E",
  	transclude: true,
  	replace: true,
  	template: '<div class="table"><div class="cell" ng-transclude></div></div>'
  }
});

/**
 * Angular's init funciton
 */
app.run(function($rootScope, $animate){
	$rootScope.isMobile = UTIL.isMobile;
	if(UTIL.isMobile){
		// Switch off ng-animate for title animations for ios, they are too delayed.
		// $animate.enabled(false);
	}

	// Handle Authentication
	$rootScope.$on('$routeChangeStart', function(e, current, prev){
		var route = current.$$route;

    // Updates title in left nav
    $rootScope.data = route.rootScopeData;

    if($rootScope.data && $rootScope.data.rootScopeData){
    	$rootScope.pageTitle = route.rootScopeData.title;
    }

    // Authenticate currentUser
    if(route.requireLogin && !$rootScope.currentUser){
    	e.preventDefault();
    	// clog(route.originalPath);
    	$location.url('/' + 'login');
    }
  });
});


/**
 * Controller
 */
app.controller('Main', function($rootScope, $scope, $timeout, $location){
	
	// Scope Reliant functions
	// =======================

	// This guy allows you to update the controller's scope from jquery or native dom events
	// by calling $scope.$emit('updateScope')
	// $digest as opposed to $apply is more efficient as it only updates the current scope
	// http://www.binpress.com/tutorial/speeding-up-angular-js-with-simple-optimizations/135
	// @params: pass fullDigest for things like $location or things in different scopes.
	$scope.$on('updateScope', function(e, fullDigest){
	  if(fullDigest){
	  	$scope.$apply();
	  }
	  else{
	  	$scope.$digest();	
	  }
	});
	


	// Pure functions
	// ==============
	
	/**
	 * Sets a one item in an array to active, set's others to false.
	 * @param {obj} item
	 * @param {Array} list
	 */
	var setActive = function(item, list){
	  list.some(function(item){
	    if(item.active){
	    	return item.active = false;
	    }
	  });
	  return item.active = true;
	};

	/**
	 * Returns a filtered array
	 * @param  {string} key 						Obj property name
	 * @param  {any} val 								Expected object prop value
	 * @param  {Array of Objects} arr 	The original unfiltered array
	 * @return {Array of Objects}	  		filtered array based on conditions
	 */
	var filterItems = function(key, val, arr){
	  return arr.filter(function(el){
	    return el[key] === val;
	  });
	};


	
	
	
});
// ==== End of Angular ====










})();