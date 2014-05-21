$(document).ready(function(){

  $('select.select2').each(function(){
    if (this.getAttribute('data-combobox') === 'true'){
      RMPlus.Utils.makeSelect2Combobox(this);
    }
    else {
      $(this).select2({width: '400px', allowClear: true});
    }
  });
  $('input[type="hidden"]').each(function(){
    if (this.getAttribute('data-combobox') === 'true'){
      RMPlus.Utils.makeSelect2Combobox(this);
    }
  });

});