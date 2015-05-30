(function(){
  "use strict";

  // Handle console
  var clog = (function(){
    var prefix = "html-guard: ";
    var convertArgs = function(args){
      return Array.prototype.slice.call(args);
    }
    if(window.console){
      var clog = function(){
        var args = convertArgs(arguments);
        console.log.apply(console, args);
      };

      clog.warn = function(){
        var args = convertArgs(arguments);
        console.warn.apply(console, args);
      }
      return clog;
    }
  })();

  var guard = {};

  guard.fetch = function(url, fn){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
      if(req.status == 200 && req.responseText){
        fn(req.responseText);
        fn = function(){};
      }
      else if(req.status == 400) {
        clog('There was a 400 error getting the source');
      }
    };
    req.open('GET', url, true);
    req.send();
  };


  guard.isAMatchingTag = (function(){
    var tags = ['input'];
    return function(str){
      return !~tags.indexOf(str);
    }
  })();

  guard.getBody = function(str){
    // var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im
    // var matches = pattern.exec(html);
    // clog(matches);
    return str.split(/(<body>|<\/body>)/ig)[2];

  };

  guard.cachedOpenTags = {};

  guard.matchingTags = function(str){
    var tags = guard.parseTags(str);
    var _this = this;

    tags.forEach(function(el){
      if(_this.isAMatchingTag(el.tag)){
        if(el.open){
          if(!_this.cachedOpenTags[el.tag]){
            _this.cachedOpenTags[el.tag] = [];
          }
          _this.cachedOpenTags[el.tag].push(el);
        }
        else if(_this.cachedOpenTags[el.tag] && _this.cachedOpenTags[el.tag].length){
          _this.cachedOpenTags[el.tag].pop();
        }
        else{
          _this.error('Unmatched closing tag: ' + el.str);
        }
      }
    });

    for(var i in this.cachedOpenTags){
      if(this.cachedOpenTags[i].length){
        this.cachedOpenTags[i].forEach(function(el){
          guard.error('Unmatched open tag: ' + el.str );
        })
      }
    }
  };

  guard.error = function(msg){
    clog.warn( (msg || 'error') + '     line: ?' );
  };

  guard.parseTags = function(str){
    var re = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g,
        match,
        arr = [];

    while( (match = re.exec(str)) !== null ){
      arr.push({str: match[0], index: match.index})
    }

    arr.forEach(function(el, i){
      var closingTag = el.str.match(/<\/.*>/g),
          openTag,
          match;
      if(closingTag){
        el.tag = closingTag[0].replace('</', '').replace('>', '');
        el.open = false;
      }
      else{
        openTag = el.str.replace('<', '').replace('>', '');
        match = openTag.match(/([^\s]+)/);
        if(match && match.length){
          el.tag = match[0];
          el.open = true;
        }
      }
    });
    return arr;
  }

  guard.stripComments = function(str){
    return str.replace(/<!--[\s\S]*?-->/g, '');
  };

  guard.stripTag = function(html, tagName) {
    return html.replace(new RegExp("<" + tagName + "[^>]*>([\\s\\S]*)</" + tagName + ">", "g"), "");
  };




  // Main error finding function
  guard.findErrors = function(str){
    str = this.getBody(str);
    str = this.stripComments(str);
    str = this.stripTag(str, 'script').trim();

    // clog(str);
    str = this.matchingTags(str);
  };


  // Initialize
  guard.fetch(window.location.href, function(str){
    guard.findErrors(str);
  });


})();