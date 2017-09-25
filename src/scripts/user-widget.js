$(document).ready(function () {

  require(["gitbook"], function(gitbook) {
    gitbook.events.bind("page.change", function(e) {
      if (gitbook.state.config.pluginsConfig.gtm.virtualPageViews) {
        var thisPath = window.location.pathname;
        var str = thisPath.split("/");
        var category = str[1].charAt(0).toUpperCase() + str[1].slice(1) || 'Home';
        var dataLayer = window.dataLayer || [];
        dataLayer.push({
          'PageTitle': gitbook.state.page.title,
          'PageCategory': category
        });
      }
    });
  });

  var userWidgetTarget = document.getElementById("user-widget");
  userWidget.init(userWidgetTarget, { accountUrl: "https://accounts.internal.platform.sh" } )
  });
