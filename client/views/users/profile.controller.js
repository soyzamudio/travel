'use strict';

angular.module('angular-prototype')
  .controller('ProfileCtrl', ['$rootScope', '$scope', '$state', 'User', function($rootScope, $scope, $state, User){
    $scope.edit = function(user) {
      User.update(user)
      .then(response => {
        $rootScope.user = response.data.user;
        $state.go('home');
      });
    };
  }]);
