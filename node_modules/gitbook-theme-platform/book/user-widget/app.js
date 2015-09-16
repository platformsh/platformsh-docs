'use strict';

/*
 * Angular module for Platform.sh user widget.
 */

angular.module('userWidget',[])
  .controller('navBar', function($scope, $http) {
    $scope.accountsPath = 'https://accounts.internal.platform.sh';
    if (typeof(accountsPath) !== "undefined") {
      $scope.accountsPath = accountsPath;
    }
    $scope.defaultUserPic = $scope.accountsPath + '/profiles/blimp_profile/themes/bootstrap_accounts/images/user-default.png';

    $scope.platform = {};

    $scope.loading = true;
    $http.get($scope.accountsPath + "/api/platform/self", {
        withCredentials: true
      })
      .success(function (data) {
        $scope.platform.user = data;
        $scope.platform.projects = data.projects;
      })
      .finally(function(){
        $scope.loading = false;
      });

    var indexedPlatforms = [];
    $scope.platformstoFilter = function(){
      indexedPlatforms = [];
      return $scope.platform.projects;
    };

    $scope.filterProjects = function(project) {
      var projectIsNew = indexedPlatforms.indexOf(project.region_label) == -1;
      if (projectIsNew) {
        indexedPlatforms.push(project.region_label);
      }
      return projectIsNew;
    };

  });
