
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

// Namespace declaration
var RMPlus = (function (my) {
  return my;
}(RMPlus || {}));

// Useful utility functions
RMPlus.Utils = (function(my) {
  var my = my || {};

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

  my.modifyFormForComboboxes = function(event, select2combobox_names){
    if(Object.prototype.toString.call(select2combobox_names) !== '[object Array]' ) {
      select2combobox_names = new Array(select2combobox_names);
    }

    event.preventDefault();
    var $this = $(this);
    var formData = $this.serializeArray();
    var newFormData = new Array();
    for (var i = 0, len1 = formData.length; i < len1; i++){
      if (select2combobox_names.contains(formData[i].name)) {
        var arr = formData[i].value.split(',');
        for (var j = 0, len2 = arr.length; j < len2; j++){
          var formValue = {name: formData[i].name, value: arr[j] };
          newFormData.push(formValue);
        }
      }
      else {
        newFormData.push(formData[i]);
      }
    }
    console.log(formData);
    console.log(newFormData);
    $.ajax({
      type: 'POST',
      url: $this.attr('action'),
      data: newFormData
    });
  };

  return my;
})(RMPlus.Utils || {});

