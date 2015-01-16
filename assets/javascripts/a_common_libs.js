// Namespace declaration
$(document).ready(function(){
  $('select.select2, input[type="hidden"], input.ui-autocomplete-input').each(function(){
    if (this.getAttribute('data-combobox') === 'true'){
      RMPlus.Utils.makeSelect2Combobox(this);
    }
    else {
      if (this.tagName.toLowerCase() === 'select') {
        var select2_width = this.getAttribute('data-select2-width');
        if ( select2_width != undefined){
          $(this).select2({width: select2_width, allowClear: true})
        }
        else {
          $(this).select2({width: '400px', allowClear: true});
        }
      }
    }
  });


});
