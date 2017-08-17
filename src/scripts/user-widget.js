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

  // Hard-code the values for the Documentation setup in particular.
  var sourcePath = '\'/scripts/user-widget/';
  var containerWrapper = '#platform-bar';
  var navbar = '<div class="platform-links" ng-app="userWidget"><div ng-include="' + sourcePath + 'user-widget.html\'"></div></div>';
  $(containerWrapper).prepend(navbar);
  });
