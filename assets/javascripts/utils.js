
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

// jQuery plugin to change the type of the html element easily
(function($) {
    $.fn.changeElementType = function(newType) {
        var attrs = {};

        $.each(this[0].attributes, function(idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function() {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    },
    $.fn.isNumber = function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

})(jQuery);

// Case-insensetive search for jQuery < 1.8
$.expr[':'].Contains = function(elem, index, match) {
  return $(elem).text().toUpperCase().indexOf(match[3].toUpperCase()) >= 0;
}

// Case-insensetive search for jQuery >= 1.8
// jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
//     return function( elem ) {
//         return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
//     };
// });

// usage:
// var visible = TabIsVisible(); // gives current state
// TabIsVisible(function(){ // registers a handler for visibility changes
//  document.title = vis() ? 'Visible' : 'Not visible';
// });
var TabIsVisible = (function(){
    var stateKey,
        eventKey,
        keys = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();

// Namespace declaration
var RMPlus = (function (my) {
  var my = my || {};
  return my;
})(RMPlus || {});

// Useful utility functions
RMPlus.Utils = (function(my) {
  var my = my || {};

  // function checks existence of the property in the RMPlus namespace recursively
  my.exists = function(prop) {
    obj = RMPlus;
    var parts = prop.split('.');
    for(var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];
      if(obj !== null && typeof obj === "object" && part in obj) {
          obj = obj[part];
      }
      else {
          return false;
      }
    }
    return true;
  }

  // useful functions to decorate autocomplete handlers, etc.
  // see http://habrahabr.ru/post/60957/  (rus),
  // http://drupalmotion.com/article/debounce-and-throttle-visual-explanation (eng) for more info
  my.debounce = function(delay, fn){
    var timer = null;
    return function(){
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    };
  }

  my.throttle = function(threshhold, fn, scope){
    threshhold || (threshhold = 250);
    var last, deferTimer;
    return function() {
      var context = scope || this;
      var now = +new Date, args = arguments;
      if (last && now < last + threshhold){
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  return my;
})(RMPlus.Utils || {});