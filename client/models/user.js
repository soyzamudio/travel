'use strict';

angular.module('angular-prototype')
  .factory('User', ['$http', function($http){

    function update(user) {
      return $http.post('/profile', user);
    }

    return {update:update};
  }]);
