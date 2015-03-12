'use strict';

angular.module('angular-prototype')
.directive('jzStripe', [() => {
  var o = {};

  o.restrict = 'A';
  o.templateUrl = '/directives/jz-stripe.html';
  o.scope = {};
  o.link = function(scope, element, attrs) {};
  o.controller = ['$scope', ($scope) => {
    $scope.x = 3;
  }];

  return o;
}]);
