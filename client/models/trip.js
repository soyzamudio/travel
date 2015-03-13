'use strict';

angular.module('angular-prototype')
  .factory('Trip', ['$http', function($http){

    function flights(vacation) {
      return $http.post('/trips/flights', vacation);
    }

    function purchaseFlights(vacationId, info) {
      return $http.post(`/vacations/${vacationId}/flights/purchase`, info);
    }

    return {flights:flights, purchaseFlights:purchaseFlights};
  }]);
