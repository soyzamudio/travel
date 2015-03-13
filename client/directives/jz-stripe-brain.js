/* global StripeCheckout:true */

'use strict';

angular.module('angular-prototype')
.directive('jzStripeBrain', [() => {
  var o = {};

  o.restrict = 'A';
  o.templateUrl = '/directives/jz-stripe-brain.html';
  o.scope = {};
  o.controller = ['$rootScope', '$scope', 'Trip', ($rootScope, $scope, Trip) => {
    let data;
    let handler = StripeCheckout.configure({
      key:   'pk_test_UmbqbTG6fdYP7ky54U1Puwbv',
      image: '/img/profile-pic.jpg',
      token: function(token) {
        data.token = token.id;
        Trip.purchaseFlights(data.vacation, data)
        .then(response => {
          $rootScope.$broadcast('flight-purchase', response.data);
        });
      }
    });

    $scope.$on('purchase', (event, info) => {
      data = info;
      handler.open({
        name:        'Travel Buddy',
        description: info.description,
        amount:      info.cost
      });
    });
  }];

  return o;
}]);
