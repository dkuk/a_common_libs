
function resize_bs_modal(obj){

  /* handle width */
  var w_width = $(window).width();
  var paddings_w = $(obj).outerWidth() - $(obj).width();

  if( $(obj).attr('data-width') !== undefined ){
    $(obj).css('margin-left', 0);
    if($(obj).attr('data-width').indexOf('%') > -1 ) {
      var left = (100 - parseInt($(obj).attr('data-width'))) / 2;
      $(obj).css('left', left.toString()+'%');
      $(obj).css('width', $(obj).attr('data-width')+'%');
    }
    else {
      var data_width = parseInt($(obj).attr('data-width'));
      var left = (w_width - data_width - paddings_w) / 2;
      $(obj).css('left', left);
      $(obj).css('width', data_width); 
    }
  }
  else if( $(obj).attr('data-min-width') !== undefined ) {

    $(obj).css('margin-left', 0);    
    $(obj).css('width', 'auto');

    $(obj).css('min-width', $(obj).attr('data-min-width'));
    var left = (w_width - $(obj).outerWidth()) / 2;
    $(obj).css('left', left);
  }





  var modal_body = $(obj).find('.modal-body')
  if( $(obj).attr('data-height') !== undefined ){
    var w_height = $(window).height();
    var ext_height = 0;
    if( $(obj).find('.modal-footer').length == 1 ) {
      ext_height += $(obj).find('.modal-footer').outerHeight()
    }
    if( $(obj).find('.modal-header').length == 1 ) {
      ext_height += $(obj).find('.modal-header').outerHeight()
    }
    var paddings_h = modal_body.outerHeight() - modal_body.height();

    var data_height = parseInt($(obj).attr('data-height'));
    var max_modal_height = 0;

    if($(obj).attr('data-height').indexOf('%') > -1 ) {
      max_modal_height = w_height*data_height/100;
      var top = (100 - data_height) / 2;
      $(obj).css('top', top.toString()+'%');
    }
    else {
      max_modal_height = data_height;
      var top = (w_height - data_height) / 2;
      $(obj).css('top', top);
    }

    modal_body.css('max-height', max_modal_height-ext_height-paddings_h);
    

    // if(modal_body.height() < modal_height-ext_height) {
      // проблемы, когда контент в окне изменяется. Нельзя вызвать циклический ресайз!
    //   var top = (w_height - $(obj).height()) / 2;
    //   // alert('smaller! top='+top)
    //   $(obj).css('top', top);
    // }
    // else {
    //   var top = (100 - parseInt($(obj).attr('data-height'))) / 2;
    //   $(obj).css('top', top.toString()+'%');
    // }
  }
}

$(document).ready(function(){

  $('.modal').on('show', function(){
    resize_bs_modal(this);
  });

  $(document.body).on('click','[data-toggle=modal]', function(){
    if( $(this).attr('data-target') !== undefined && $(this).attr('data-modal-height') !== undefined ) {
      // todo: make for href='#modalId'
      $($(this).attr('data-target')).attr('data-height',$(this).attr('data-modal-height'));
    }

    if( $(this).attr('data-target') !== undefined && $(this).attr('data-modal-width') !== undefined ) {
      // todo: make for href='#modalId'
      $($(this).attr('data-target')).attr('data-width',$(this).attr('data-modal-width'));
    }    
  });

  $(window).on('resize', function(){
    $('.modal').each(function(){
      resize_bs_modal(this);
    })
  });

});