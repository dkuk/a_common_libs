if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement, fromIndex) {
        for(var i = fromIndex||0, length = this.length; i<length; i++)
            if(this[i] === searchElement) return i;
        return -1
  };
}

// jQuery plugin to change the type of the html element easily
(function ($) {
    $.fn.changeElementType = function (newType) {
        var attrs = {};

        $.each(this[0].attributes, function (idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function () {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    },
    $.fn.isNumber = function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
})(jQuery);

// jQuery plugin to get string representation of the element
(function ($) {
  $.fn.outerHTML = function () {
    return $(this).clone().wrap('<div></div>').parent().html();
  }
})(jQuery);

// usage:
// var visible = TabIsVisible(); // gives current state
// TabIsVisible(function(){ // registers a handler for visibility changes
//  document.title = vis() ? 'Visible' : 'Not visible';
// });
var TabIsVisible = (function () {
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
    return function (c) {
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
RMPlus.Utils = (function (my) {
  var my = my || {};

  // function checks existence of the property in the RMPlus namespace recursively
  my.exists = function (prop) {
    obj = RMPlus;
    var parts = prop.split('.');
    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];
      if (obj !== null && typeof obj === "object" && part in obj) {
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
  my.debounce = function (delay, fn) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  my.throttle = function (threshhold, fn, scope) {
    threshhold || (threshhold = 250);
    var last, deferTimer;
    return function () {
      var context = scope || this;
      var now = +new Date, args = arguments;
      if (last && now < last + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
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


 $(document).ready(function () {
  // Fast editing (pencil near select box fields)
  $('<a href="#" class="icon icon-edit rmp-fast-link no_line"></a>').insertAfter('.rmp-fast-edit');
  $(document.body).on('click', 'a.rmp-fast-link', function () {
    var sb_val = $(this).prev('select.rmp-fast-edit').val();
    if (sb_val != '')
      document.location.href = $(this).prev('select.rmp-fast-edit').attr('data-edit-url').split('0').join(sb_val);
    else
      document.location.href = $(this).prev('select.rmp-fast-edit').attr('data-add-url');
    return false;
  });

});

