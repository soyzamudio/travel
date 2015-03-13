/* global StripeCheckout:true */

'use strict';

angular.module('angular-prototype')
.directive('jzStripe', [() => {
  var o = {};

  o.restrict = 'A';
  o.templateUrl = '/directives/jz-stripe.html';
  o.scope = {
    vacation: '=',
    cost:       '=',
    description:      '=',
    itinerary:  '='
  };
  o.link = function(scope, element, attrs) {};
  o.controller = ['$rootScope', '$scope', ($rootScope, $scope) => {
    $scope.purchase = function() {
      var info = {
        vacation: $scope.vacation,
        cost: $scope.cost * 100,
        description: $scope.description,
        itinerary: $scope.itinerary
      };
      $rootScope.$broadcast('purchase', info);
    };
  }];

  return o;
}]);
