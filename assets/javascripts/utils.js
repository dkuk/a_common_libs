
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

if (('isArray' in Array) === false){
  Array.prototype.isArray = function() {
    return Object.prototype.toString.call(this) === '[object Array]';
  }
}

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

  // Function makes select2 combobox out of text field
  // Accepts jquery selector and init data (as a js array)
  my.makeSelect2MultiCombobox = function(selector, init_data){
    var $selector = $(selector);
    // add combobox flag, if not already present
    if ($selector.attr('data-multicombobox') !== "true") {
      $selector.attr('data-multicombobox', 'true');
    }

    init_data = init_data || $selector.val();

    if (Object.prototype.toString.call(init_data) === '[object String]') {
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
    var $form = $(this);
    var form = this;

    $form.find('input[type="text"]').each(function(index){
      if ($(this).attr('data-multicombobox') === "true"){
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

  my.makeSelect2Combobox = function(selector){
    var $selector = $(selector);

    var get_url = selector.getAttribute('data-get-url') || '';
    var post_url = selector.getAttribute('data-post-url') || '';
    var placeholder = RMPlus.Utils.ajax_placeholder || 'Please, enter the data';
    var min_search_length = parseInt(selector.getAttribute('data-min-search-length')) || 0;

    var data_select2 = [];
    //$(selector)
    // $.ajax({url: get_url,
    //         type: 'get',
    //         dataType: 'json',
    //         data: {},
    //         success: function(data){
    //           if data.isArray() {
    //             for (var i = 0, len = data.length; i < len; i++){

    //             }
    //           }
    //           else if (Object.prototype.toString.call(data) === '[object Object]'){

    //           }
    //         },
    //         fail: function(jqXHR, textStatus, error){

    //         }
    //       });
    //for (var i = 0, len = init_data.length; i < len; i++){
    //  data_select2[i] = {id: init_data[i], text: init_data[i]};
    //}

    $selector.select2({ width: '400px',
                        placeholder: placeholder,
                        allowClear: true,
                        minimumInputLength: min_search_length,
                        query: function (query) {
                          var data = {}, found = false, text, term;
                          data.results = [];
                          if (query.term) {
                            for (var i = 0, len = choices.length; i < len; i++) {
                              text = choices[i].text.toLocaleUpperCase();
                              term = query.term.toLocaleUpperCase();
                              if (text.localeCompare(term) === 0) {
                                found = true;
                                break;
                              }
                            }
                            if (!found){
                              data.results.push({ id: query.term, text: query.term });
                              // $.ajax({
                              //   url: post_url,
                              //   dataType: 'json',
                              //   data: {},
                              //   success: function(ajax_data){
                              //     data.results.push({ id: query.term, text: query.term });
                              //   },
                              //   fail: function(jqXHR, textStatus, error){

                              //   },
                              //   complete: function(jqXHR, textStatus){

                              //   }
                              // });
                            }
                          }
                          for (var i = 0, len = choices.length; i < len; i++) {
                            text = Select2.util.stripDiacritics(choices[i].text).toUpperCase();
                            term = Select2.util.stripDiacritics(query.term).toUpperCase();
                            if (text.indexOf(term) >= 0) {
                              data.results.push(choices[i]);
                            }
                          }
                          query.callback(data);
                        }
                     })
    .on("change", function() {
      var result = $selector.select2('val'),
          found = false;

      if (!result) return;

      for (var i = 0, len = choices.length; i < len; i++) {
        if (choices[i].id.localeCompare(result) === 0) {
          found = true;
          break;
        }
      }
      if (!found) {
        choices.splice(0, 0, {id: result, text: result});
        //choices.push({id: result, text: result});
      }
    });
  };

  return my;
})(RMPlus.Utils || {});

