'use strict';

angular.module('angular-prototype')
  .factory('Vacation', ['$http', function($http){

    function create(vacation){
      return $http.post('/vacations', vacation);
    }

    function findAll() {
      return $http.get('/vacations');
    }

    function show(vacationId){
      return $http.get('/vacations/' + vacationId);
    }

    return {create:create, findAll:findAll, show:show};
  }]);
