// Namespace declaration
var RMPlus = (function (my) {
  var my = my || {};
  return my;
})(RMPlus || {});

RMPlus.LIB = (function (my) {
  var my = my || {};

  my.resize_bs_modal = function (obj) {
    /* handle width */
    var w_width = $(window).width();
    var w_height = $(window).height();
    var paddings_w = $(obj).outerWidth() - $(obj).width();
    var px_width;
    var px_height;
    // var max_px_height = 0;

    if ($(obj).attr('data-width') !== undefined) {
      $(obj).css('margin-left', 0);
      if ($(obj).attr('data-width').indexOf('%') > -1) {
        px_width = w_width*parseInt($(obj).attr('data-width'))/100;
      }
      else {
        px_width = parseInt($(obj).attr('data-width'));
      }

      var left = (w_width - px_width - paddings_w) / 2;
      $(obj).css('left', left);
      $(obj).css('width', px_width);
    }
    else if ($(obj).attr('data-min-width') !== undefined) {
      $(obj).css('margin-left', 0);
      $(obj).css('width', 'auto');

      $(obj).css('min-width', $(obj).attr('data-min-width'));
      var left = (w_width - $(obj).outerWidth()) / 2;
      $(obj).css('left', left);
    }


    var modal_body = $(obj).find('.modal-body')
    if ($(obj).attr('data-height') !== undefined) {
      var ext_height = 0;
      if ($(obj).find('.modal-footer').length == 1) {
        ext_height += $(obj).find('.modal-footer').outerHeight()
      }
      if ($(obj).find('.modal-header').length == 1) {
        ext_height += $(obj).find('.modal-header').outerHeight()
      }
      var paddings_h = modal_body.outerHeight() - modal_body.height();

      if ($(obj).attr('data-height').indexOf('%') > -1) {
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
    if (typeof $(obj).attr('data-onload-height') != 'undefined') {
      modal_body.height($(obj).attr('data-onload-height')+'px');
      $(obj).removeAttr('data-onload-height');
    }
    else {
      modal_body.css('height','');
    }
  } /* resize_bs_modal ENDS */

  my.render_dynamic_bs_modal = function (link_obj) {
    var modal_w;
    var m_body = '<div class="modal-body"></div>';
    var $link = $(link_obj);
    var cur_bs = $('#bs-modal-dynamic');
    if ( typeof $link.attr('data-store-parent-height') != 'undefined' && $link.parents('#bs-modal-dynamic').length > 0 && typeof $link.attr('data-modal-load-height') == 'undefined') {
      $link.attr('data-modal-load-height', cur_bs.find('.modal-body').height());
    }

    cur_bs.modal('hide');
    cur_bs.remove();

    if (typeof $link.attr('data-iframe') != 'undefined') {
      m_body = '<iframe class="modal-body modal-iframe" height="825px" frameborder="0" hspace="0" src="'+$link.attr('href')+'" scrolling="auto"></iframe>';
    }
    if ( typeof $link.attr('data-target') == 'undefined' || $($link.attr('data-target')).length < 1) {
      var close_label = (typeof $link.attr('data-close-label') != 'undefined') ? $link.attr('data-close-label') : 'Close';
      $('<div id="bs-modal-dynamic" class="modal I fade" tabindex="-1" role="dialog" aria-hidden="true" style="z-index: 1061;">'+
          m_body+
           '<div class="modal-footer">'+
             '<button class="" data-dismiss="modal" aria-hidden="true" style="vertical-align: middle;">'+close_label+'</button>'+
           '</div>'+
         '</div>').appendTo(document.body);

      modal_w = $('#bs-modal-dynamic');
      $link.attr('data-target','#bs-modal-dynamic')
    } else {
      modal_w = $($link.attr('data-target'));
    }

    if ( typeof $link.attr('data-modal-height') != 'undefined' ) {
      // todo: make for href='#modalId'
      modal_w.attr('data-height', $link.attr('data-modal-height'));
    }
    if ( typeof $link.attr('data-modal-width') != 'undefined' ) {
      // todo: make for href='#modalId'
      modal_w.attr('data-width', $link.attr('data-modal-width'));
    }
    if ( typeof $link.attr('data-modal-min-width') != 'undefined' ) {
      // todo: make for href='#modalId'
      modal_w.attr('data-min-width', $link.attr('data-modal-min-width'));
    }

    if ( typeof $link.attr('data-modal-load-height') != 'undefined' ) {
      modal_w.attr('data-onload-height', $link.attr('data-modal-load-height'));
    }

    if (typeof $link.attr('href') != 'undefined') {
      if ( typeof $link.attr('data-show-loader') != 'undefined') {
        modal_w.find('.modal-body').html('<div class="big_loader form_loader"></div>');
      }
      // for load it self and trigger resize due loaded.bs.modal does not work
      if (typeof $link.attr('data-load-self') != 'undefined') {
        modal_w.find('.modal-body').load(link_obj.href, function () {
          $('.tabs-buttons').hide();
          RMPlus.LIB.resize_bs_modal(modal_w.get(0));
        });
        modal_w.modal('show');
        return false;
      }
    }
    if (typeof $link.attr('data-iframe') != 'undefined') {
      modal_w.modal('show');
      return false;
    }
    return true;
  }

  my.load_bs_ajax_form = function (link) {
    var form_div = $('#'+$(link).attr('data-target'));
    if (form_div.length > 0) {
      form_div.html('<div class="loader form_loader"></div>');
      form_div.modal('show');
      form_div.load(link.href, function () {
          $('.tabs-buttons').hide();
          RMPlus.LIB.resize_bs_modal(form_div);
      });
    }
    return false;
  }


  return my;
})(RMPlus.LIB || {});



$(document).ready(function () {

  $('.modal').prependTo(document.body);

  $(document.body).on('show', '.modal', function () {
    RMPlus.LIB.resize_bs_modal(this);
  });

  $(document.body).on('hide', '.modal', function () {
    $('a:focus').blur();
  });

  // $(document.body).on('ajaxstop', '.modal-body', function () {
  //   RMPlus.LIB.resize_bs_modal(this);
  // });

  $(window).on('resize', function () {
    $('.modal').each(function () {
      RMPlus.LIB.resize_bs_modal(this);
    });
  });

  $(document.body).on('click', '.bs-ajax-form', function () {
    return RMPlus.LIB.load_bs_ajax_form(this);
  });

  $(document.body).on('click','[data-toggle=modal]', function () {
    return RMPlus.LIB.render_dynamic_bs_modal(this);
  });

});