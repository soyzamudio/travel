'use strict';

angular.module('angular-prototype')
  .controller('VacationsListCtrl', ['$scope', 'Vacation', ($scope, Vacation) => {
    Vacation.findAll().then((response) => {
      $scope.vacations = response.data.vacations;
    });
  }]);
