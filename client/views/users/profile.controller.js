'use strict';

angular.module('angular-prototype')
  .controller('ProfileCtrl', ['$rootScope', '$scope', '$state', '$window' ,'User', function($rootScope, $scope, $state, $window, User){
    $scope.edit = function(user) {
      User.update(user)
      .then(response => {
        $window.localStorage.user = JSON.stringify(response.data.user);
        $rootScope.user = response.data.user;
        $state.go('home');
      });
    };
  }]);
