
// Rewrite of the redmine 'observeSearchfield' function from application.js
// Avoids checking for input value in a loop, shorter and cleaner code
//
// Note the event handler function is wrapped in RMPlus.Utils.debounce function call.
// debounce is deferring function execution for amount of milliseconds specified in the first argument
// As a result, autocomplete behaviour is more user-friendly, and it avoids doing useless checks and
// requests to server while the user is still typing.
(function(){

  // store original reference to the method, may be useful for future refactoring
  var showTab_without_patches  = showTab;

  showTab = function (name, url, container) {
    var $tab = $('#tab-' + name);
    container = (typeof container == 'undefined' ? 'div.tabs' : container.toString( ));
    var $par_ul = $tab.parents(container).first();
    $par_ul.find('li a').each(function (index) {
      $(this).removeClass('selected');
      var tab_name = $(this).attr('id').split('tab-')[1];
      // console.log(tab_name)
      $('#tab-content-' + tab_name).hide();
    });
    $('#tab-content-' + name).show();
    $tab.addClass('selected');
    //replaces current URL with the "href" attribute of the current link
    //(only triggered if supported by browser)
    // if ('replaceState' in window.history) {
    //   window.history.replaceState(null, document.title, url);
    // }

    var loc = location.href.split('#');
    var loc_tabbed = loc[0].split('tab=');
    var loc_clear = loc_tabbed[0];
    if (loc_tabbed.length>1) {
      var loc_vars = loc_tabbed[1].split('&')
      for (var l=1;l<loc_vars.length; l++) {
        loc_clear = loc_clear+'&'+loc_vars[l];
      }
    }

    if (loc_clear[loc_clear.length-1] == '?' || loc_clear[loc_clear.length-1] == '&') {
      loc_clear = loc_clear.substring(0, loc_clear.length - 1)
    }

    var q_pos = loc_clear.indexOf('?');
    if (q_pos == -1) {
      loc_clear = loc_clear + '?tab=' + name;
    } else {
      loc_clear = loc_clear + '&tab=' + name;
    }
    if ('replaceState' in window.history) {
      window.history.replaceState(null, document.title, loc_clear);
    }
    return false;
  }

  var observeSearchfield_without_patches = observeSearchfield;

  observeSearchfield = function(fieldId, targetId, url){
    $('body').on('keyup click mousemove', '#' + fieldId, RMPlus.Utils.debounce(300, function(){
      var $this = $(this);
      $this.addClass('autocomplete');
      // console.log('good function!');
      var value = $this.val();
      var old_value = $this.attr('data-value-was');
      if (value !== old_value) {
        $this.attr('data-value-was', value);
        $.ajax({
          url: url,
          type: 'get',
          data: {q: value},
          success: function(data){ if (targetId) $('#'+targetId).html(data); },
          beforeSend: function(){ $this.addClass('ajax-loading'); },
          complete: function(){ $this.removeClass('ajax-loading'); }
        });
      }
    }));
  };
})();