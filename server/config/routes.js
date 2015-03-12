'use strict';

module.exports = [
  {method: 'get', path: '/{param*}', config: require('../routes/general/static')},

  {method: 'post', path: '/auth/signup', config: require('../routes/users/register')},
  {method: 'post', path: '/auth/login', config: require('../routes/users/login')},

  {method: 'post', path: '/auth/github', config: require('../routes/users/github')},
  {method: 'post', path: '/auth/facebook', config: require('../routes/users/facebook')},
  {method: 'post', path: '/auth/linkedin', config: require('../routes/users/linkedin')},
  {method: 'get', path: '/auth/twitter', config: require('../routes/users/twitter')},

  {method: 'get', path: '/vacations', config: require('../routes/vacations/index')},
  {method: 'post', path: '/vacations', config: require('../routes/vacations/create')},
  {method: 'get', path: '/vacations/{vacationId}', config: require('../routes/vacations/show')},

  {method: 'post', path: '/trips/flights', config: require('../routes/trips/flights')}
];
