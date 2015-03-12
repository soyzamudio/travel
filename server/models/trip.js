/* jshint camelcase:false */

'use strict';

var mongoose = require('mongoose');
var Request = require('request');
var _ = require('lodash');
var moment = require('moment');
var Trip;

var tripSchema = mongoose.Schema({
  title: {type: String, required: true},
  originAirport: {type: String, required: true},
  destinationAirport: {type: String, required: true},
  destinationCity: {type: String, required: true},
  departureDate: {type: Date, required: true},
  returnDate: {type: Date, required: true},
  fare: {type: Number, required: true},
  userId: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  createdAt: {type: Date, default: Date.now, required: true}
});

tripSchema.statics.flights = function(o, cb) {
  var options = {
    method: 'POST',
    url: 'https://api.test.sabre.com/v1/auth/token',
    headers: {
      'Authorization': process.env.SABRE_KEY,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  };

  Request(options, function(err, response, body){
    var token = JSON.parse(body).access_token;
    let url = 'https://api.test.sabre.com/v1/shop/flights?origin=' + o.departureAirport + '&destination=' + o.arrivalAirport + '&departuredate=' + moment(o.departureDate).format('YYYY-MM-DD') + '&returndate=' + moment(o.arrivalDate).format('YYYY-MM-DD');
    var options = {
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Bearer ' + token
        }
      };

    Request(options, function(err, response, body){
      body = JSON.parse(body);
      var itineraries = body.PricedItineraries || [];
      if (err) { cb(true); }
      cb(itineraries);
    });
  });
};

Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
