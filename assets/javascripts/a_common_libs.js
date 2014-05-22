$(document).ready(function(){

  $('select.select2, input[type="hidden"]').each(function(){
    if (this.getAttribute('data-combobox') === 'true'){
      RMPlus.Utils.makeSelect2Combobox(this);
    }
    else {
      if (this.tagName.toLowerCase() === 'select') {
        $(this).select2({width: '400px', allowClear: true});
      }
    }
  });

});