
// Rewrite of the redmine 'observeSearchfield' function from application.js
// Avoids checking for input value in a loop, shorter and cleaner code
//
// Note the event handler function is wrapped in RMPlus.Utils.debounce function call.
// debounce is deferring function execution for amount of milliseconds specified in the first argument
// As a result, autocomplete behaviour is more user-friendly, and it avoids doing useless checks and
// requests to server while the user is still typing.
(function(){

  // store original reference to the method, may be useful for future refactoring
  var _old = observeSearchfield;

  observeSearchfield = function(fieldId, targetId, url){
    $('body').on('keyup click mousemove', '#' + fieldId, RMPlus.Utils.debounce(300, function(){
      var $this = $(this);
      $this.addClass('autocomplete');
      console.log('good function!');
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