
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

  // Function makes select2 combobox out of text field
  // Accepts jquery selector and init data (as a js array)
  my.makeSelect2Combobox = function(selector, init_data){
    var $selector = $(selector);
    // add combobox flag, if not already present
    if ($selector.attr('data-combobox') !== "true") {
      $selector.attr('data-combobox', 'true');
    }

    init_data = init_data || $selector.val();

    if( Object.prototype.toString.call(init_data) === '[object String]' ) {
      if (init_data.length > 0){
        init_data = init_data.split(',');
      }
      else {
        init_data = [];
      }
    }

    // make data array with objects with id and text properties out of ordinary values array (select2 requirement)
    var data_select2 = [];
    for (var i = 0, len = init_data.length; i < len; i++){
      data_select2[i] = {id: init_data[i], text: init_data[i]};
    }

    // populate text field with init values
    if ($selector.val() === "") {
      $selector.val(init_data);
    }

    // You can't enter text in select2 textfield without createSearchChoice function defined
    $selector.select2({
      createSearchChoice: function(term, data){
        if ($(data).filter(function() { return this.text.localeCompare(term) === 0; }).length === 0){
          return {id:term, text:term};
        }
      },
      multiple: true,
      width: 'resolve',
      data: data_select2
    });
  }

  // There is problem with using Select2 in 'data' mode with text inputs to handle arrays.
  // Select2 keeps all entered items as a concatenated comma-separated string in input "value" attribute
  // This function catches all such inputs marked with 'data-combobox' flag, and replaces them with selects with options
  // so that arrays will be sent the right way.
  my.modifyFormForComboboxes = function(event){
    //event.preventDefault();
    var $form = $(this);
    var form = this;

    $form.find('input[type="text"]').each(function(index){
      if ($(this).attr('data-combobox') === "true"){
        var value = $(this).val();
        var valuesArray = value.split(',');
        var name = this.name;
        $(this).remove();

        var $select = $('<select multiple="multiple" tabindex="-1" style="display: none;"></select>');
        $select.attr('id', name);
        $select.attr('name', name);
        for (var i = 0, len = valuesArray.length; i < len; i++){
          var $option = $('<option selected="selected"></option>');
          $option.val(valuesArray[i]);
          $option.appendTo($select);
        }

        $(form).append($select);
      }
    });
    return true;
  };

  return my;
})(RMPlus.Utils || {});

