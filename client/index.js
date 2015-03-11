'use strict';

angular.module('angular-prototype', ['ui.router', 'ngMessages', 'satellizer'])
  .config(['$stateProvider', '$urlRouterProvider', '$authProvider', function($stateProvider, $urlRouterProvider, $authProvider){
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {url:'/', templateUrl:'/views/general/home.html'})
      .state('faq', {url:'/faq', templateUrl:'/views/general/faq.html'})
      .state('contact', {url:'/contact', templateUrl:'/views/general/contact.html'})

      .state('vacations', {url: '/vacations', templateUrl: '/views/vacations/vacations.html', abstract: true})
      .state('vacations.new', {url: '/new', templateUrl: '/views/vacations/vacations_new.html', controller:'VacationsNewCtrl'})
      .state('vacations.list', {url: '', templateUrl: '/views/vacations/vacations_list.html', controller:'VacationsListCtrl'})
      .state('vacations.show', {url: '/{vacationId:[0-9a-f]{24}}', templateUrl: '/views/vacations/vacations_show.html', controller:'VacationsShowCtrl'})

      .state('register', {url:'/register', templateUrl:'/views/users/users.html', controller:'UsersCtrl'})
      .state('login', {url:'/login', templateUrl:'/views/users/users.html', controller:'UsersCtrl'});

    $authProvider.github({ clientId: '0a24748ef0db0e815151' });
    $authProvider.facebook({ clientId: '469311433222452' });
    $authProvider.linkedin({ clientId: '75yrdmxns6b39p' });
    $authProvider.twitter({ url: '/auth/twitter' });

  }])
  .run(['$rootScope', '$window', '$auth', function($rootScope, $window, $auth){
    if ($auth.isAuthenticated()) {
      $rootScope.user = JSON.parse($window.localStorage.user);
    }
  }]);
