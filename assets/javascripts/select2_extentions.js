RMPlus.Utils = (function(my) {
  var my = my || {};

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
        $form.append($select);
      }
    });
    return true;
  };

  my.makeSelect2Combobox = function(selector, width){
    var get_url = selector.getAttribute('data-get-url') || '';
    var post_url = selector.getAttribute('data-post-url') || '';
    var model_attribute = selector.getAttribute('data-model-attribute') || 'name';
    var width = width || "copy";

    var placeholder = RMPlus.Utils.combobox_placeholder;
    var min_search_length = parseInt(selector.getAttribute('data-min-search-length')) || 0;

    var data_select2 = [];
    var init_value = undefined;
    if (selector.tagName.toLowerCase() === 'select'){
      var $selector = $(selector);
      init_value = ($selector.val() || '').toString();
      $.each($selector.children(), function(){
        data_select2.push({id: this.value, text: this.textContent });
      });
      $selector.children().remove();
      $selector.changeElementType('input');

      selector = document.getElementById(selector.id);
    }
    var $selector = $(selector);
    if (init_value) { $selector.val(init_value); }

    $selector.select2({ width: width,
                        placeholder: placeholder,
                        allowClear: true,
                        minimumInputLength: min_search_length,
                        containerCssClass: 'hint--error hint--top hint--rounded',
                        initSelection: function(element, callback) {
                          var data = {};
                          if (init_value) {
                            for (var sch = 0; sch < data_select2.length; sch ++) {
                              if (data_select2[sch].id.toString() == init_value) { data = data_select2[sch]; break; }
                            }
                          }
                          callback(data);
                        },
                        query: function (query) {
                          var data = {}, found = false, text, term;
                          data.results = [];
                          if (query.term) {
                            for (var i = 0, len = data_select2.length; i < len; i++) {
                              text = data_select2[i].text.toLocaleUpperCase();
                              term = query.term.toLocaleUpperCase();
                              if (text.localeCompare(term) === 0) {
                                found = true;
                                break;
                              }
                            }
                            if (!found){
                              data.results.push({ id: query.term, text: query.term });
                            }
                          }
                          for (var i = 0, len = data_select2.length; i < len; i++) {
                            text = data_select2[i].text.toUpperCase();
                            term = query.term.toUpperCase();
                            if (text.indexOf(term) >= 0) {
                              data.results.push(data_select2[i]);
                            }
                          }
                          query.callback(data);
                        }
                     })
    .on("change blur close", function(event){
      $('#s2id_' + selector.id).removeAttr('data-hint');
      $('#s2id_' + selector.id).removeClass('hint--always');

      var result = $selector.select2('val');
          found = false;

      if (!result) return;

      for (var i = 0, len = data_select2.length; i < len; i++) {
        if (data_select2[i].id === $.trim(result)){
          return;
        }
        if (typeof data_select2[i].id === 'undefined') {
          if (data_select2[i].id.localeCompare(result) === 0) {
            found = true;
            break;
          }
        }
      }
      if (!found) {
        var ajax_object = {};
        ajax_object[model_attribute] = $.trim(result);
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
            data_select2.sort(function(a, b){
              var nameA=$.trim(a.text.toLowerCase()),
                  nameB=$.trim(b.text.toLowerCase());
              if (nameA === "")
                return -1;
              if (nameA < nameB)
                return -1;
              if (nameA > nameB)
                return 1;
              if (nameA === nameB)
                return 0;
            });
            $selector.select2("data", {id: data.id, text: data[model_attribute]});
          },
          error: function(jqXHR, textStatus, error){
            var $select2_container = $('#s2id_' + selector.id);

            if (jqXHR.status === 404) {
              $select2_container.attr('data-hint', RMPlus.Utils.combobox_404);
            } else {
              $select2_container.attr('data-hint', RMPlus.Utils.combobox_error);
            }
            $select2_container.addClass('hint--always');
            $selector.select2('val', '');
          },
          complete: function(jqXHR, textStatus){
            $('#s2id_' + selector.id + ' .select2-chosen').removeClass('select2-spinner');
            var $form = $(selector.form);
            $form.find('input[name="commit"]').removeProp('disabled');
            $form.off("submit");
          }
        });
      }
    }).on("click", function(event) {
      $('#s2id_' + selector.id).removeClass('hint--always');
      $('#s2id_' + selector.id).removeAttr('data-hint');
    });
  };

  return my;
})(RMPlus.Utils || {});