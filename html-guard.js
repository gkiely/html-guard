(function(){
  "use strict";

  // Handle console
  var clog = (function(){
   // var prefix = "html-guard: ";
    var convertArgs = function(args){
      return Array.prototype.slice.call(args);
    };
    if(window.console){
      var clog = function(){
        var args = convertArgs(arguments);
        console.log.apply(console, args);
      };
      clog.warn = function(){
        var args = convertArgs(arguments);
        console.warn.apply(console, args);
      };
      return clog;
    }
  })();

  var guard = {
    bodyLineNumber: 0
  };

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
    var tags = [ 'br', 'col', 'embed', 'hr', 'img', 'input', 'source'];
    return function(str){
      return !~tags.indexOf(str);
    };
  })();

  guard.getBody = function(str){
    return str.split(/(<body>|<\/body>)/ig)[2];
  };

  guard.cachedOpenTags = {};


  // Matched tags main function
  guard.matchTags = function(str){
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
          _this.error('Unmatched closing tag: ', el);
          _this.detailedError(el);
        }
      }
    });

    for(var i in this.cachedOpenTags){
      if(this.cachedOpenTags[i].length){
        this.cachedOpenTags[i].forEach(function(el){
          _this.error('Unmatched open tag: ', el);
        });
      }
    }
  };
   
  guard.error = function(msg, el){
    clog.warn( msg + el.str + '     line number: ' + el.line );
  };

  guard.storeDetailedError = function(){
    
  };
  guard.detailedError = function(el){
    var s1 = this.bodyStr.substring(0, el.index).trimLeft();
    clog(s1 + '%c' + '<' + el.tag + '>', 'background: yellow');
  };

  guard.parseTags = function(str){
    var re = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g,
        line,
        match,
        matchLine,
        arr = [],
        reLine = /\n/g;

    // Get the line numbers for each elem.
    while( (match = re.exec(str)) !== null ){
      line = this.getLineNumberFromIndex(match.index, str) + this.bodyLineNumber  - 1; 
      // clog(line);
      arr.push({str: match[0], index: match.index, line: line});
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
  };

  guard.stripComments = function(str){
    return str.replace(/<!--[\s\S]*?-->/g, '');
  };

  guard.stripTag = function(html, tagName) {
    return html.replace(new RegExp("<" + tagName + "[^>]*>([\\s\\S]*)</" + tagName + ">", "g"), "");
  };

  /**
   * function for getting line number
   */
  guard.getLineNumber = function(reg, str){
    var index = this.getIndex(reg, str);
    return this.getLineNumberFromIndex(index, str);
  };

  guard.getIndex = function(reg, str){
    var match = reg.exec(str);
    return match.index
  };

  guard.getLineNumberFromIndex = function(i, str){
    var matchLine,
        regLine = /\n/g,
        line = 1;

    while( (matchLine = regLine.exec(str)) !== null && matchLine.index < i){
      line++;
    }
    return line;
  };

  // Main error finding function
  guard.findErrors = function(str){
    this.bodyLineNumber = this.getLineNumber(/<body[^>]*>/, str);
    str = this.bodyStr = this.getBody(str);
    str = this.stripComments(str);
    str = this.stripTag(str, 'script');

    // clog(str);
    this.matchTags(str);
  };


  // Initialize
  guard.fetch(window.location.href, function(str){
    guard.str = str;
    guard.findErrors(str);
    // guard.detailedErrors();
  });
})();