require(["gitbook"], function(gitbook) {
  gitbook.events.bind("page.change", function() {

    $('.book-search input[type="text"]').prop('placeholder', 'Search');

    // Replacing glossary term elements.
    $('.glossary-term').each(function(){
      var message = $(this).prop('title');
      var term = $(this).text();
      $(this).replaceWith('<span class="glossary-term">' + term + '<span class="tooltip-wrapper"><span class="tooltip">' + message + '</span></span></span>');
    });

  });
});
