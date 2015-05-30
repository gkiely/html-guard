var clog = (function(){if(window.console && ~window.location.host.indexOf("localhost") ) return function clog(val){console.log(val);};else return function clog(){};})();


// Class Code
// ========

// @desc: set's properties for object passed in
function setProps (_this, inst) {
	for(var i in inst){
		_this[i] = inst[i];
	}
}

//@desc: set's properties to instance, calls init function if present
// if third param: calls checkReqs
function setPropsAndInit(_this, inst, req){
	if(req){
		checkReqs(req, inst);
	}
  setProps(_this, inst);
  if(typeof inst.init === "function"){
  	inst.init.apply(_this);	
  }
}

// @desc: checks requirements for class object
function checkReqs(reqs, inst){
  if(inst){
  	for(var i in reqs){
  		if(inst.hasOwnProperty(i)){
  			if(!reqs[i](inst[i])){
  				throw new Error('Type Error for property: ' + i );
  			}
  		}
  		else{
  			throw new Error('Class instance is missing the property: ' + i );
  		}
  	}
  }
  else{
  	throw new Error('You did not include an object in your class instance.');
  }
}

let type = {
	$: function(){
	  
	},
	arr: function(arr){
		return Array.isArray(arr);
	},
	bool: function(b){
	  return typeof b === "bool";
	},
	dom: function(node){
	  return node.nodeName ? true : false;
	},
	int: function(val){
	  return !isNaN(val);
	},
	str: function(s){
	 return typeof s === "string"; 
	},
	optional: function(){
	  return true;
	}
}



window.UTIL = {};


//UTIL methods
(function(){
//Detect mobile devices
//updated: jun 22 2014
//Check if new regex is being used
//go here -> http://detectmobilebrowsers.com/
//then here -> http://jsbeautifier.org/
//copy what's between the if statement
UTIL.isMobile = (function(){
    var a = navigator.userAgent || navigator.vendor || window.opera;
    //also check's ipad
    if(/(iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent)) return true;
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
})();


UTIL.mobileFlag = /\?mobile/.test(window.location.href);

var timer={};
var firstCall = {

};

UTIL.timer = function timer(func, time, amount){
    clearTimeout(timer);
    var name, reg;
    
    // Find the function name
    if(Function.name){
      name = func.name
    }
    else{
        reg = func.toString().match(/^function\s*([^\s(]+)/);
        if(reg && reg[1]){
          name = reg[1];
        }
    }

    // Set the timeout
    if(name){
      timer[name] = setTimeout(func, time || 0);
    }
    else{
      name = 'name';
      setTimeout(func, time || 0);
    }

    if(amount > 0){
      if(!firstCall[name]){
        firstCall[name] = true;
        --amount;
      }

      setTimeout(function(){
        UTIL.timer(func, time || 0, --amount);        
      }, time || 0);
    }
}
})();



