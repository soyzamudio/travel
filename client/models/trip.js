'use strict';

angular.module('angular-prototype')
  .factory('Trip', ['$http', function($http){

    function flights(vacation) {
      return $http.post('/trips/flights', vacation);
    }

    return {flights:flights};
  }]);
