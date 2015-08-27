$(document).ready(function () {

  // Default will be used mostly for Drupal scenarios.
  var sourcePath = '/profiles/blimp_profile/libraries/';
  var containerWrapper = '.navbar .container';
  // If gitbook.
  if ($('#platform-bar').length) {
    sourcePath = '\'/gitbook/plugins/gitbook-theme-platform/';
    containerWrapper = '#platform-bar';
  }
  // If jekyll.
  if ($('.navbar a.navbar-brand').length) {
    sourcePath = '\'/javascripts/';
  }
  var navbar = '<div class="platform-links" ng-app="userWidget"><div ng-include="' + sourcePath + 'user-widget/user-widget.html\'"></div></div>';

  $(containerWrapper).prepend(navbar);
});
