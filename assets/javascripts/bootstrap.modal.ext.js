
function resize_bs_modal(obj){
  /* handle width */
  var w_width = $(window).width();
  var w_height = $(window).height();
  var paddings_w = $(obj).outerWidth() - $(obj).width();
  var px_width;
  var px_height;
  // var max_px_height = 0;

  if( $(obj).attr('data-width') !== undefined ){
    $(obj).css('margin-left', 0);
    if($(obj).attr('data-width').indexOf('%') > -1 ) {
      px_width = w_width*parseInt($(obj).attr('data-width'))/100;
    }
    else {
      px_width = parseInt($(obj).attr('data-width'));
    }

    var left = (w_width - px_width - paddings_w) / 2;
    $(obj).css('left', left);
    $(obj).css('width', px_width);
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
    var ext_height = 0;
    if( $(obj).find('.modal-footer').length == 1 ) {
      ext_height += $(obj).find('.modal-footer').outerHeight()
    }
    if( $(obj).find('.modal-header').length == 1 ) {
      ext_height += $(obj).find('.modal-header').outerHeight()
    }
    var paddings_h = modal_body.outerHeight() - modal_body.height();

    if($(obj).attr('data-height').indexOf('%') > -1 ) {
      px_height = w_height*parseInt($(obj).attr('data-height'))/100;
    }
    else {
      px_height = parseInt($(obj).attr('data-height'));
    }

    var top = (w_height - px_height) / 2;
    $(obj).css('top', top);
    modal_body.css('max-height', px_height-ext_height-paddings_h);
    

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

  $(document.body).on('click','[data-toggle=modal]', function() {
    if( $(this).attr('data-target') !== undefined ) {
      if( $(this).attr('data-modal-height') !== undefined ) {
        // todo: make for href='#modalId'
        $($(this).attr('data-target')).attr('data-height',$(this).attr('data-modal-height'));
      }
  
      if( $(this).attr('data-modal-width') !== undefined ) {
        // todo: make for href='#modalId'
        $($(this).attr('data-target')).attr('data-width',$(this).attr('data-modal-width'));
      }
  
      if( $(this).attr('data-modal-min-width') !== undefined ) {
        // todo: make for href='#modalId'
        $($(this).attr('data-target')).attr('data-min-width',$(this).attr('data-modal-min-width'));
      }
    }

  });

  $(window).on('resize', function(){
    $('.modal').each(function(){
      resize_bs_modal(this);
    })
  });

});