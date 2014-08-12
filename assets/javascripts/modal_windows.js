$(document).ready(function(){

  jQuery(document.body).on('click', '.link_to_modal', function () {
    var this_link = jQuery(this);
    var id = this_link.attr('id');
    if (typeof id== 'undefined' || id.length == 0) {
      var d = new Date();
      var r = Math.random().toString().split('.')[1];
      id = 'mw-'+d.getHours().toString()+d.getMinutes().toString()+d.getSeconds().toString()+d.getMilliseconds().toString()+'-'+r;
      this.id = id;
    }
    var link = this_link.offset();
    if (jQuery("#modal-"+id).length == 0){
      click_out_class = this_link.hasClass('click_out') ? ' click_out' : ''
      cur_window = jQuery('<div/>', {id: 'modal-'+id, class: 'modal_window'+click_out_class});
    }
    else {
      cur_window = jQuery("#modal-"+id);
    }
    cur_window.prependTo(document.body);

    if (this_link.hasClass('over_parent_window')) {
      var parent_z_index = this_link.parents('div.modal_window:first').zIndex();
      cur_window.zIndex(parent_z_index + 1);
    }
    else {
      jQuery("div.modal_window").hide();
    }

    if ( (cur_window.text() != '' || cur_window.hasClass('permanent_modal_window') || this_link.hasClass('static_content_only')) && !this_link.hasClass('refreshable') ){
      show_modal(id);
    }
    else{
      this_link.addClass("invisible_link");
      jQuery("#mw_content_load").css("left", link.left);
      jQuery("#mw_content_load").css("top", link.top);
      jQuery("#mw_content_load").show();
      cur_window.load(this_link.attr("href"), function(){show_modal(id)});
    }

    return false;
  });

  $(document.body).on('click', function (event) {
    var x = event.pageX;
    var y = event.pageY;
    var outside = false;
    $('[id^="modal-"]').filter(function() {
      var element = $(this);
      if(element.css('display') === 'none') {
        return false;
      }
      return true;
    }).each(function(){
      var outside_each = false;
      var m = $(this);
      var left = (parseInt(this.getAttribute('data-left')) || 0);
      var right = left + m.outerWidth( ) || 0;
      var top = (parseInt(this.getAttribute('data-top')) || 0);
      var bottom = top + m.outerHeight( ) || 0;
      if (left > 0 && right > 0 && top > 0 && bottom > 0){
        if (x < left || x > right || y < top || y > bottom){
          outside_each = true;
        }
      }
      else {
        outside_each = true
      }
      outside = outside || outside_each;
    });
    if( !$(event.target).hasClass("modal_window") && $(event.target).parents("div.modal_window").length == 0 && outside){
      $("div.modal_window").hide();
    }
  });

  jQuery(document.body).on('mouseleave', "div.modal_window", function (evt) {
    var mw_div = jQuery(evt.target)

    if (!mw_div.hasClass('modal_window')){
      mw_div = jQuery(evt.target).parents(".modal_window")
    }

    if (evt.target.nodeName.toLowerCase() !== "select" && !mw_div.hasClass("click_out")) {
      jQuery(this).hide();
      jQuery(this).trigger('modal_window_hidden');
    }
  })


  jQuery(".close_modal_window").click(function(){
    jQuery(this).parent().hide();
    jQuery(this).parent().trigger('modal_window_hidden');
  })


  // jQuery("div.modal_window, div.permanent_modal_window").insertBefore(jQuery("div").first());

  $(document).ajaxStop(function() {
    // destroy orphans windows (who has no parent link)
    jQuery("body > div.modal_window").each(function(){
      var ln = jQuery(this).attr('id').split('modal-')[1]
      if ( jQuery("#"+ln).length == 0 ) {
        jQuery(this).remove();
      }
    });
    // open windows which was loaded via ajax
    jQuery('.for_open').trigger('click');
    jQuery('.for_open').removeClass('for_open');
  });

  // open windows once on first page load
  jQuery('.for_open').trigger('click');
  jQuery('.for_open').removeClass('for_open');

  append_loader();
});


function append_loader(){
  if (jQuery("#mw_content_load").length == 0) {
    jQuery(document.body).append('<div id="mw_content_load" class="loader">&nbsp;</div>');
  }
}


function show_modal(id) {
  jQuery("#"+id).removeClass("invisible_link");
  jQuery("#mw_content_load").hide();

  var link = jQuery('#'+id).offset();
  link.top = link.top - jQuery(document).scrollTop();
  link.left = link.left - jQuery(document).scrollLeft();
  link.width = jQuery('#'+id).outerWidth();
  link.height = jQuery('#'+id).outerHeight();

  var cur_window = jQuery("#modal-"+id);
  var mw_width = cur_window.outerWidth();
  var mw_height = cur_window.outerHeight();
  var doc_w = jQuery(window).width();
  var doc_h = jQuery(window).height();
  var margin = 5;


  // if ( (jQuery(window).width() < cur_window.outerWidth()+link.left+link.width+margin) && (link.left < margin+cur_window.outerWidth()) ) {
  //   borders_w = cur_window.outerWidth()-cur_window.width()
  //   new_w = (link.left > jQuery(window).width()-(link.left+link.width+margin*2)) ? link.left-borders_w : jQuery(window).width()-(link.left+link.width+borders_w);
  //   cur_window.width(new_w-margin*2);
  // }

  // right from element - is default
  cur_window.css("left", link.left+link.width+margin+jQuery(document).scrollLeft());

  if( jQuery("#"+id).hasClass("left-preffered") || doc_w < mw_width+link.left+link.width+margin) {
    // try to display left if preffered left or no space at right
    if ( mw_width < link.left) {
      cur_window.css("left", link.left-margin-mw_width+jQuery(document).scrollLeft());
    }
  }


  // vertical position - default down
  cur_window.css('top', link.top+jQuery(document).scrollTop());

  if ( jQuery('#'+id).hasClass('top-preffered') || doc_h < link.top+mw_height-link.height ) { // && cur_window.outerHeight() < link.top+link.height) {
    // try to display as preffered no space bottom or top-preffered and
    if (mw_height < link.top+link.height) {
      cur_window.css('top', link.top+jQuery(document).scrollTop()+link.height-mw_height);
    }
  }

  cur_window.show();
  cur_window.trigger('modal_window_shown');

  if (cur_window.find('div.select2-container, input.ui-autocomplete-input').length > 0){
    var offset = cur_window.offset();
    cur_window.attr('data-left', offset.left);
    cur_window.attr('data-top', offset.top);
  }
}