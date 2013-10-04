
function resize_rm_modal(obj){
  /* handle width */
  var scroll_top = $(window).scrollTop();
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
    $(obj).css('top', top+scroll_top);
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

  $(document.body).on('click', '.rm_modal_link', function(){
    var cur_window;
    var overlay;

    if( $(this).attr('data-target') !== undefined) {
      var id = $(this).attr('data-target');
      if($("#"+id).length == 0){
        cur_window = $('<div/>', {id: id, class: 'rm_modal'});
      }
      else {
        cur_window = $("#"+id);
      }

      cur_window.prependTo(document.body);

      if($("#rm_modal_overlay").length == 0){
        overlay = $('<div/>', {id: 'rm_modal_overlay'});
      }
      else {
        overlay = $("#rm_modal_overlay");
      }
      overlay.appendTo(document.body);


      if( $(this).attr('data-modal-height') !== undefined ) {
        cur_window.attr('data-height',$(this).attr('data-modal-height'));
      }
      if( $(this).attr('data-modal-width') !== undefined ) {
        cur_window.attr('data-width',$(this).attr('data-modal-width'));
      }
      if( $(this).attr('data-modal-min-width') !== undefined ) {
        cur_window.attr('data-min-width',$(this).attr('data-modal-min-width'));
      }

      resize_rm_modal(cur_window);
      overlay.show();
      cur_window.show();
      if($(this).attr('href') !== undefined){
        cur_window.html("<div class='loader form_loader'></div>");
        cur_window.load(this.href, function(){
            $('.tabs-buttons').hide();
            resize_rm_modal(cur_window);
        }); 
        return false;
      }
    }
  });

  $(document.body).on('click','#rm_modal_overlay, .rm_modal_close', function(){
    $('.rm_modal').hide();
    $('#rm_modal_overlay').hide();
    return false;
  });

  // $('.rm_modal').on('show', function(){
  //   resize_rm_modal(this);
  // });

  // $(document.body).on('click','[data-toggle=rm_modal]', function(){   
  // });

  $(window).on('resize', function(){
    $('.rm_modal').each(function(){
      resize_rm_modal(this);
    })
  });

  $(window).on('scroll', function(){
    $('.rm_modal').each(function(){
      resize_rm_modal(this);
    })
  });

});