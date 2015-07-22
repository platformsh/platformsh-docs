require(["gitbook"], function(gitbook) {
    gitbook.events.bind("page.change", function() {
        $('.book-search input[type="text"]').prop('placeholder', 'Search');
        $('.book-search').css('top', '73px');
        $('.book-search').css('display', 'block');
    });
});
