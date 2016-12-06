$(document).ready(function () {

  require(["gitbook"], function(gitbook) {
    gitbook.events.bind("page.change", function() {
      $('.book-summary ul.summary li li').addClass('hidden');
      // $('ul.summary li').find('li.active').parent().children().show();
      $('.book-summary ul.summary li li.active').parents().children().removeClass('hidden');
      $('.book-summary ul.summary li.active > ul > li').removeClass('hidden');
    });
  });
});
