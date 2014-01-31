
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

  $(document.body).on('show', '.modal', function () {
    resize_bs_modal(this);
  });

  $(document.body).on('ajaxstop', '.modal-body', function () {
    resize_bs_modal(this);
  });

  $(window).on('resize', function(){
    $('.modal').each(function(){
      resize_bs_modal(this);
    })
  });

  $(document.body).on('hide', '.modal', function () {
    if (this.id == 'bs-modal-dynamic')
      $(this).remove();
  });

  $(document.body).on('click','[data-toggle=modal]', function() {
    var modal_w;
    var m_body = '<div class="modal-body"></div>';
    if (typeof $(this).attr('data-iframe') != 'undefined') {
      var m_body = '<iframe class="modal-body modal-iframe" height="825px" frameborder="0" hspace="0" src="'+$(this).attr('href')+'" scrolling="auto"></iframe>';
    }
    if ( typeof $(this).attr('data-target') == 'undefined' || $($(this).attr('data-target')).length < 1) {
      $('#bs-modal-dynamic').remove();
      var close_label = (typeof $(this).attr('data-close-label') != 'undefined') ? $(this).attr('data-close-label') : 'Close';
      $('<div id="bs-modal-dynamic" class="modal I fade" tabindex="-1" role="dialog" aria-hidden="true" style="z-index: 1061;">'+
          m_body+
           '<div class="modal-footer">'+
             '<button class="" data-dismiss="modal" aria-hidden="true" style="vertical-align: middle;">'+close_label+'</button>'+
           '</div>'+
         '</div>').appendTo(document.body);

      modal_w = $('#bs-modal-dynamic');
      $(this).attr('data-target','#bs-modal-dynamic')
    } else {
      modal_w = $($(this).attr('data-target'));
    }

    if ( typeof $(this).attr('data-modal-height') != 'undefined' ) {
      // todo: make for href='#modalId'
      modal_w.attr('data-height',$(this).attr('data-modal-height'));
    }
    if ( typeof $(this).attr('data-modal-width') != 'undefined' ) {
      // todo: make for href='#modalId'
      modal_w.attr('data-width',$(this).attr('data-modal-width'));
    }
    if ( typeof $(this).attr('data-modal-min-width') != 'undefined' ) {
      // todo: make for href='#modalId'
      modal_w.attr('data-min-width',$(this).attr('data-modal-min-width'));
    }

    if ( typeof $(this).attr('data-show-loader') != 'undefined' && typeof $(this).attr('href') != 'undefined') {
      modal_w.find('.modal-body').html('<div class="loader form_loader"></div>');
    }
    if (typeof $(this).attr('data-iframe') != 'undefined') {
      modal_w.modal('show');
      return false;
    }
  });

});