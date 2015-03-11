/* jshint camelcase:false */

'use strict';

let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  title: {type: String, required: true},
  departureDate: {type: Date, required: true},
  arrivalDate: {type: Date, required: true},
  departureAirport: {type: String, required: true},
  arrivalAirport: {type: String, required: true},
  userId: {type: mongoose.Schema.ObjectId, ref: 'User'},
  createdAt:   {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('Vacation', userSchema);
