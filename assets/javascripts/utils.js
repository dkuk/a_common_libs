
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
    }
})(jQuery);

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
    var $form = $(selector.form);
    var get_url = selector.getAttribute('data-get-url') || '';
    var post_url = selector.getAttribute('data-post-url') || '';
    var model_attribute = selector.getAttribute('data-model-attribute') || 'name';

    var placeholder = RMPlus.Utils.combobox_placeholder;
    var min_search_length = parseInt(selector.getAttribute('data-min-search-length')) || 0;

    var data_select2 = [];
    // if (selector.tagName.toLowerCase() === 'select'){
    //   var $selector = $(selector);
    //   $.each($selector.children(), function(){
    //     data_select2.push({id: this.value, text: this.innerText });
    //   });
    //   $selector.children().remove();
    //   $selector.changeElementType('input');

    //   selector = document.getElementById(selector.id);
    // }
    var $selector = $(selector);

    $selector.select2({ width: '400px',
                        placeholder: placeholder,
                        allowClear: true,
                        minimumInputLength: min_search_length,
                        containerCssClass: 'hint--error hint--top hint--rounded',
                        // query: function (query) {
                        //   var data = {}, found = false, text, term;
                        //   data.results = [];
                        //   if (query.term) {
                        //     for (var i = 0, len = data_select2.length; i < len; i++) {
                        //       text = data_select2[i].text.toLocaleUpperCase();
                        //       term = query.term.toLocaleUpperCase();
                        //       if (text.localeCompare(term) === 0) {
                        //         found = true;
                        //         break;
                        //       }
                        //     }
                        //     if (!found){
                        //       data.results.push({ id: query.term, text: query.term });
                        //     }
                        //   }
                        //   for (var i = 0, len = data_select2.length; i < len; i++) {
                        //     text = data_select2[i].text.toUpperCase();
                        //     term = query.term.toUpperCase();
                        //     if (text.indexOf(term) >= 0) {
                        //       data.results.push(data_select2[i]);
                        //     }
                        //   }
                        //   query.callback(data);
                        // }
                     })
    .on("change blur close select2-blur select2-close", function(event) {
      console.log($selector.select2('val'));
      console.log($selector.find(':selected').text());

      $('#s2id_' + selector.id).removeAttr('data-hint');
      $('#s2id_' + selector.id).removeClass('hint--always');

      var result = $selector.find(":selected").text(),
          found = false;

      if (!result) return;

      for (var i = 0, len = data_select2.length; i < len; i++) {
        if (data_select2[i].id.localeCompare(result) === 0) {
          found = true;
          break;
        }
      }
      if (!found) {
        var ajax_object = {};
        ajax_object[model_attribute] = result;
        $.ajax({
          url: post_url,
          type: 'post',
          dataType: 'json',
          data: ajax_object,
          beforeSend: function() {
            $('#s2id_' + selector.id + ' .select2-chosen').addClass('select2-spinner');
            var $form = $(selector.form);
            $form.find('input[name="commit"]').prop('disabled', 'disabled');
            $form.on("submit", function(event){
              event.preventDefault();
            });
          },
          success: function(data){
            data_select2.splice(0, 0, {id: data.id, text: data[model_attribute]});
          },
          error: function(jqXHR, textStatus, error){
            if (jqXHR.status === 404) {
              $('#s2id_' + selector.id).attr('data-hint', RMPlus.Utils.combobox_404);
            } else {
              $('#s2id_' + selector.id).attr('data-hint', RMPlus.Utils.combobox_error);
            }
            $('#s2id_' + selector.id).addClass('hint--always');
          },
          complete: function(jqXHR, textStatus){
            $('#s2id_' + selector.id + ' .select2-chosen').removeClass('select2-spinner');
            var $form = $(selector.form);
            $form.find('input[name="commit"]').removeProp('disabled');
            $form.off("submit");
            //data_select2.splice(0, 0, {id: -1, text: result});
          }
        });
      }
    }).on("click", function(event) {
      $('#s2id_' + selector.id).removeClass('hint--always');
      $('#s2id_' + selector.id).removeAttr('data-hint');
    }).on("select2-clearing", function(event){
      event.preventDefault();
    });
  };
  $('input.select2-input').each(function(){
    $(this).on('keypress keyup keydown', function(event){
      console.log(event.target);
    });
  });

  return my;
})(RMPlus.Utils || {});