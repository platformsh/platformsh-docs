require(["jQuery", "gitbook"], function($, gitbook) {

  var init = function() {
    $(".book").on("click", "a[data-reveal]", function(e) {
      e.preventDefault();
      $(this).closest("div.reveal").find(".revealable").addClass("hidden");
      $(document.getElementById($(this).data("reveal"))).removeClass("hidden");
      $(this).siblings(".btn-primary").removeClass("btn-primary");
      $(this).addClass("btn-primary");
    });
  };

  gitbook.events.bind("start", init);
});
