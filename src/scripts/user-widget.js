$(document).ready(function () {

  // Hard-code the values for the Documentation setup in particular.
  var sourcePath = '\'/scripts/user-widget/';
  var containerWrapper = '#platform-bar';

  var navbar = '<div class="platform-links" ng-app="userWidget"><div ng-include="' + sourcePath + 'user-widget.html\'"></div></div>';
  var wrapper = $(containerWrapper);
    wrapper.prepend(navbar);
  });
