/*
@svgjs
@version: 1.1
@author: Grant Kiely
@date: 21/6/14

Awesomeness
-Easy way to cache svg's
-Allows styling of svg
-Loads async

Todo
Perf-wise
-make just one queryselector call, slice to array and filter for each arr elem
    http://jsperf.com/find-children-vs-queryselectoral/3
-change innerHTML to doc fragment
    -First create a function that converts string to document fragment and test against inner
    http://jsperf.com/document-fragment-vs-innerhtml-vs-looped-appendchild
-Make it work in every browser and fallback to png for ie using image.vida.io?
http://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser
-Checkout <svg> <img /> </svg for fallback


//Instructions
-Get svg code & put in arr
-If you want to compress to one line: http://www.textfixer.com/html/compress-html-compression.php
    -Or open in devtools and it compresss to around 3 lines
-Create div: <div data-svg="svg_id_here"></div>
-Put script in head <script async="js/svg.js" async></script>
*/


var SVGJS = (function(){

	var arr = [
        '<svg class="location-pin" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="24px" height="31px" viewBox="0 0 24 31" enable-background="new 0 0 24 31" xml:space="preserve"><path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M12,0C5.373,0,0,5.206,0,11.625C0,18.045,12,31,12,31  s12-12.955,12-19.375C24,5.206,18.627,0,12,0z M20,11.625c0,4.28-3.582,7.75-8,7.75s-8-3.47-8-7.75s3.582-7.75,8-7.75  S20,7.346,20,11.625z"/></svg>',
        '<svg class="nav-close" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="35.983px" height="35.984px" viewBox="0 0 35.983 35.984" enable-background="new 0 0 35.983 35.984" xml:space="preserve"><path fill-rule="evenodd" clip-rule="evenodd" fill="#fff" d="M1.251,35.984L0.568,35.33L34.733,0l0.682,0.654L1.251,35.984z"/><path fill-rule="evenodd" clip-rule="evenodd" fill="#fff" d="M0,1.249l0.654-0.683l35.33,34.17l-0.653,0.683L0,1.249z"/></svg>',
        '<svg class="nav-fb" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="8.207px" height="17.008px" viewBox="0 0 8.207 17.008" enable-background="new 0 0 8.207 17.008" xml:space="preserve"><path fill="#FFFFFF" d="M0,5.625h1.758V3.916C1.758,3.162,1.777,2,2.325,1.28C2.901,0.518,3.693,0,5.054,0 c2.218,0,3.152,0.316,3.152,0.316L7.767,2.921c0,0-0.733-0.212-1.417-0.212c-0.684,0-1.296,0.245-1.296,0.929v1.986h2.804 L7.663,8.169H5.054v8.839H1.758V8.169H0V5.625z"/></svg>',
        '<svg class="book-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="70px" height="90px" viewBox="0 0 70 90" enable-background="new 0 0 70 90" xml:space="preserve"><g><path d="M21.113,49.348h28v-9h-28V49.348z M60,0H10C4.5,0,0,4.5,0,10v70c0,5.5,4.5,10,10,10h50c5.5,0,10-4.5,10-10V10 C70,4.5,65.5,0,60,0z M60,80H10V10h50V80z M49,20.848H21v8.75h28V20.848z M49,60.098H21v8.75h28V60.098z"/></g></svg>'
	];

    var div = document.createElement('div'),
        nl=[]; //nodelist

    function init(){
        var list, ll, sel,
            l = arr.length;


        //check for data-svg and place svg
        for(var i =0; i<l; i++){
            div.innerHTML = arr[i];
            nl.push(div.firstChild);

            sel = (div.firstChild.classList ?  div.firstChild.classList[0] : false) || div.firstChild.className.animVal;
            list = document.querySelectorAll('[data-svg="'+sel+'"]');
            ll = list.length;
            for(var j=0; j<ll; j++){
                list[j].appendChild(div.firstChild.cloneNode(true));
            }
        }
    }

    //Initialise
	var ready = document.readyState;
	if(ready === "complete" || ready ==="interactive"){
		init();
	}
	else{
        document.addEventListener("DOMContentLoaded", init);
    }

    return{
        load: function(node){
            var sel;
            if(typeof node === 'string')
                node = document.querySelector(node);

            var val = node.getAttribute('data-svg');
            for(var i =0; i< nl.length; i++){
                sel = (nl[i].classList ?  nl[i].classList[0] : false) || nl[i].className.animVal;
                if(~sel.indexOf(val)){
                    return node.appendChild(nl[i]);
                }

            }
        }
    }
  	
})();