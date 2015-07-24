require(["gitbook"], function(gitbook) {
    gitbook.events.bind("page.change", function() {
        $('.book-search input[type="text"]').prop('placeholder', 'Search');
        $('.book-search').css('top', '73px');
        $('.book-search').css('display', 'block');
    });
  // Replacing glossary term elements.
  $('.glossary-term').each(function(){
    var message = $(this).prop('title');
    var term = $(this).text();
    if (message) {
      $(this).replaceWith('<span class="glossary-term">' + term + '<span class="tooltip-wrapper"><span class="tooltip">' + message + '</span></span></span>');
    }
  });

  // Using same technique as gitbook-richquotes-plugin, but using our own markup.
  $('blockquote').each(function(){
    $strong = $(this).find('p:first-child > strong:first-child').text();
    $(this).find('p:first-child > strong:first-child').remove();
    if ($strong) {
      switch ( $strong.toLowerCase() )
      {
        /* info */
        case "info" :
        case "note" :
          alert = "info";
          break;
        /* success */
        case "hint" :
        case "success" :
          alert = "success";
          break;
        /* warning */
        case "warning" :
        case "caution" :
          alert = "warning";
          break;
        /* danger */
        case "danger" :
          alert = "danger";
          break;
        /* quote */
        case "quote" :
          alert = "quote";
          break;
        /* see also */
        case "see also" :
          alert = "see-also";
          break;
        default :
          return;
      }

      $(this).addClass( 'clearfix alert alert-' + alert );
      $(this).prepend( '<label class="quote-label label-' + alert + '">' + $strong + '</label>' );
    }
  });
});
