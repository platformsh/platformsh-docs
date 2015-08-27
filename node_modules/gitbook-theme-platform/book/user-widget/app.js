'use strict';

/*
 * Angular module for Platform.sh user widget.
 */

angular.module('userWidget',[])
  .controller('navBar', function($scope, $http){
    $scope.accountsPath = 'https://accounts.platform.sh';
    $scope.defaultUserPic = $scope.accountsPath + '/profiles/blimp_profile/themes/bootstrap_accounts/images/user-default.png';

    $scope.platform = [];

    // This is the hardcoded json array provided by Christian.
    $scope.platform = {
      "projects": [
        {
          "uri": "https:\/\/us.platform.sh\/#\/projects\/klsl6lh2ord3c",
          "name": "Awesome Website",
          "plan": "Development",
          "license_id": "5755"
        },
        {
          "uri": "https:\/\/us.platform.sh\/#\/projects\/6rw4zftgkblqc",
          "name": "TMC 2.x Test",
          "plan": "Development",
          "license_id": "5588"
        },
        {
          "uri": "https:\/\/us.platform.sh\/#\/projects\/klsl6lh2ord3c",
          "name": "Awesome Website",
          "plan": "Development",
          "license_id": "5755"
        },
        {
          "uri": "https:\/\/us.platform.sh\/#\/projects\/6rw4zftgkblqc",
          "name": "TMC 2.x Test",
          "plan": "Development",
          "license_id": "5588"
        },
        {
          "uri": "https:\/\/us.platform.sh\/#\/projects\/klsl6lh2ord3c",
          "name": "Awesome Website",
          "plan": "Development",
          "license_id": "5755"
        },
        {
          "uri": "https:\/\/us.platform.sh\/#\/projects\/6rw4zftgkblqc",
          "name": "TMC 2.x Test",
          "plan": "Development",
          "license_id": "5588"
        },
        {
          "uri": "https:\/\/us.platform.sh\/#\/projects\/klsl6lh2ord3c",
          "name": "Awesome Website",
          "plan": "Development",
          "license_id": "5755"
        },
        {
          "uri": "https:\/\/us.platform.sh\/#\/projects\/6rw4zftgkblqc",
          "name": "TMC 2.x Test",
          "plan": "Development",
          "license_id": "5588"
        },
        {
          "uri": "https:\/\/us.platform.sh\/#\/projects\/klsl6lh2ord3c",
          "name": "Awesome Website",
          "plan": "Development",
          "license_id": "5755"
        },
        {
          "uri": "https:\/\/us.platform.sh\/#\/projects\/6rw4zftgkblqc",
          "name": "TMC 2.x Test",
          "plan": "Development",
          "license_id": "5588"
        }
      ],
      "user": {
        "name": "Admin Marketplace",
        "uid": "1",
        "uuid": "d7c034f8-d9ba-43a2-898a-1dc96f84913d",
        "mail": "user_1@example.com",
        "picture": "http:\/\/marketplace.dev\/sites\/default\/files\/pictures\/picture-208-1436972167.jpg",
        "links": [
          "https:\/\/marketplace.commerceguys.com\/user",
          "https:\/\/marketplace.commerceguys.com\/user\/logout"
        ]
      }
    }

  });
