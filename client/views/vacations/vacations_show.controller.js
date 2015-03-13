'use strict';

angular.module('angular-prototype')
  .controller('VacationsShowCtrl', ['$scope', '$state', 'Vacation', 'Trip', ($scope, $state, Vacation, Trip) => {
    $scope.currentPage = 1;
    $scope.pageSize = 5;
    $scope.itineraries;

    Vacation.show($state.params.vacationId)
    .then((response) => {
      $scope.vacation = response.data.vacation;
      console.log($scope.vacation);
    });

    $scope.$on('flight-purchase', (event, vacation) => {
      console.log('show.controller.js | this is the vacation:', vacation);
      $scope.vacation = vacation;
    });

    $scope.findFlights = function() {
      Trip.flights($scope.vacation)
      .then(response => {
        $scope.itineraries = response.data.itineraries;
        console.log($scope.itineraries);
      });
    };
  }]);
