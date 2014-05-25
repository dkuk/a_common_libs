// Namespace declaration
var RMPlus = (function (my) {
  var my = my || {};
  return my;
})(RMPlus || {});

RMPlus.LIB = (function (my) {
  var my = my || {};

  my.resize_bs_modal = function (obj) {
    /* handle width */
    var $bs_modal = $(obj);
    var w_width = $(window).width();
    var w_height = $(window).height();
    var paddings_w = $bs_modal.outerWidth() - $bs_modal.width();
    var px_width;
    var px_height;
    // var max_px_height = 0;

    if ($bs_modal.attr('data-width') != undefined) {
      $bs_modal.css('margin-left', 0);
      if ($bs_modal.attr('data-width').indexOf('%') > -1) {
        px_width = w_width*parseInt($bs_modal.attr('data-width'))/100;
      }
      else {
        px_width = parseInt($bs_modal.attr('data-width'));
      }

      var left = (w_width - px_width - paddings_w) / 2;
      $bs_modal.css('left', left);
      $bs_modal.css('width', px_width);
    }
    else if ($bs_modal.attr('data-min-width') !== undefined) {
      $bs_modal.css('margin-left', 0);
      $bs_modal.css('width', 'auto');

      $bs_modal.css('min-width', $bs_modal.attr('data-min-width'));
      var left = (w_width - $bs_modal.outerWidth()) / 2;
      $bs_modal.css('left', left);
    }
    var $modal_body = $bs_modal.find('.modal-body');
    var $modal_footer = $bs_modal.find('.modal-footer');
    var $modal_header = $bs_modal.find('.modal-footer');

    // set initial height
    if (typeof $bs_modal.attr('data-header-height') != 'undefined' ||
        typeof $bs_modal.attr('data-body-height') != 'undefined' ||
        typeof $bs_modal.attr('data-footer-height') != 'undefined' ||
        typeof $bs_modal.attr('data-full-height') != 'undefined') {
      $modal_header.height($bs_modal.attr('data-header-height')+'px');
      $modal_body.height($bs_modal.attr('data-body-height')+'px');
      $modal_footer.height($bs_modal.attr('data-footer-height')+'px');
      $bs_modal.height($bs_modal.attr('data-full-height')+'px');
      $bs_modal.removeAttr('data-header-height');
      $bs_modal.removeAttr('data-body-height');
      $bs_modal.removeAttr('data-footer-height');
      $bs_modal.removeAttr('data-full-height');
    }
    else {
      $modal_header.css('height','');
      $modal_body.css('height','');
      $modal_footer.css('height','');
      $bs_modal.css('height','');
    }


    if ($bs_modal.attr('data-height') != undefined) {
      var ext_height = 0;
      if ($modal_footer.length == 1) {
        ext_height += $modal_footer.outerHeight()
      }
      if ($modal_header.length == 1) {
        ext_height += $modal_header.outerHeight()
      }
      var paddings_h = $modal_body.outerHeight() - $modal_body.height();

      if ($bs_modal.attr('data-height').indexOf('%') > -1) {
        px_height = w_height*parseInt($bs_modal.attr('data-height'))/100;
      }
      else {
        px_height = parseInt($bs_modal.attr('data-height'));
      }

      var top = (w_height - px_height) / 2;
      $bs_modal.css('top', top);
      $modal_body.css('max-height', px_height-ext_height-paddings_h);


      // if($modal_body.height() < modal_height-ext_height) {
        // проблемы, когда контент в окне изменяется. Нельзя вызвать циклический ресайз!
      //   var top = (w_height - $bs_modal.height()) / 2;
      //   // alert('smaller! top='+top)
      //   $bs_modal.css('top', top);
      // }
      // else {
      //   var top = (100 - parseInt($bs_modal.attr('data-height'))) / 2;
      //   $bs_modal.css('top', top.toString()+'%');
      // }
    }

  } /* resize_bs_modal ENDS */

  my.store_previous_bs_modal_size_and_hide = function (link) {
    var $link = $(link);
    var $cur_bs = $link.parents('.modal').first();
    if (typeof $cur_bs != 'undefined') {
      if ( typeof $link.attr('data-save-previous-height') != 'undefined') {
        $link.attr('data-body-height', $cur_bs.find('.modal-body').height());
        $link.attr('data-footer-height', $cur_bs.find('.modal-footer').height());
        $link.attr('data-header-height', $cur_bs.find('.modal-footer').height());
        $link.attr('data-full-height', $cur_bs.height());
      }
      $cur_bs.modal('hide');
      if($cur_bs.attr('id') == 'bs-modal-dynamic') $cur_bs.remove();
    }
  }

  my.fill_bs_modal_attrs = function ($link, $bs_modal) {
    if ( typeof $link.attr('data-modal-height') != 'undefined' ) {
      // todo: make for href='#modalId'
      $bs_modal.attr('data-height', $link.attr('data-modal-height'));
    }
    if ( typeof $link.attr('data-modal-width') != 'undefined' ) {
      // todo: make for href='#modalId'
      $bs_modal.attr('data-width', $link.attr('data-modal-width'));
    }
    if ( typeof $link.attr('data-modal-min-width') != 'undefined' ) {
      // todo: make for href='#modalId'
      $bs_modal.attr('data-min-width', $link.attr('data-modal-min-width'));
    }

    if ( typeof $link.attr('data-body-height') != 'undefined' ) {
      $bs_modal.attr('data-body-height', $link.attr('data-body-height'));
    }
    if ( typeof $link.attr('data-footer-height') != 'undefined' ) {
      $bs_modal.attr('data-footer-height', $link.attr('data-footer-height'));
    }
    if ( typeof $link.attr('data-header-height') != 'undefined' ) {
      $bs_modal.attr('data-header-height', $link.attr('data-header-height'));
    }
  }

  my.render_dynamic_bs_modal = function (link) {

    var $link = $(link);
    RMPlus.LIB.store_previous_bs_modal_size_and_hide(link);
    var $target = $($link.attr('data-target') || ($link.href && $link.href.replace(/.*(?=#[^\s]+$)/, '')));

    // Render dynamic modal
    if ($target.length == 0) {
      var m_footer = '<div class="modal-footer">'+
                       '<button data-dismiss="modal" aria-hidden="true" style="vertical-align: middle;">'+
                         ((typeof $link.attr('data-close-label') != 'undefined') ? $link.attr('data-close-label') : 'Close')+
                       '</button>'+
                     '</div>';
      $target = $('<div id="bs-modal-dynamic" class="modal I fade" role="dialog" aria-hidden="true" style="z-index: 1061;"></div>');
      var modal_type = $link.attr('data-modal-type')
      if (typeof modal_type != 'undefined' && modal_type == 'clear') {
        // do nothing - content will be load to modal base
      } else if (typeof modal_type != 'undefined' && (modal_type == 'iframe' || modal_type == 'iframe-only')) {
        if (modal_type == 'iframe-only') { m_footer = '' }
        $('<iframe class="modal-body modal-iframe" height="825px" frameborder="0" hspace="0" src="'+$link.attr('href')+'" scrolling="auto"></iframe>'+m_footer).appendTo($target);
      }
      else {
        // default bootsrap modal - load nothing, only sizes
        $('<div class="modal-body"></div>'+m_footer).appendTo($target);
      }

      $target.appendTo(document.body);
      RMPlus.LIB.fill_bs_modal_attrs($link, $target);

      if (typeof modal_type != 'undefined' && (modal_type == 'iframe' || modal_type == 'iframe-only')) {
        $target.modal('show');
        return false;
      } else {
        // load data self and trigger resize due loaded only sciense 3rd Bottstrap
        var $load_to = $target.find('.modal-body');
        if ($load_to.length == 0) { $load_to = $target }
        if ($link.hasClass('show-loader')) {
          $load_to.html('<div class="big_loader form_loader"></div>');
        }
        // for load it self and trigger resize due loaded.bs.modal does not work
        $load_to.load(link.href, function () {
          $('.tabs-buttons').hide();
          RMPlus.LIB.resize_bs_modal($target.get(0));
        });
        $target.modal('show');
        return false;
      }
    } else {
      // standart BS Modal behaviour with sizes
      // skip show, load etc. leave this actions to BS javascript
      RMPlus.LIB.fill_bs_modal_attrs($link, $target);
    }
    return true;

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

  $(document.body).on('click','[data-toggle=modal]', function () {
    return RMPlus.LIB.render_dynamic_bs_modal(this);
  });

});