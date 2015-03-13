/* jshint camelcase:false */

'use strict';

let mongoose = require('mongoose');
let stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var Vacation;

let vacationSchema = mongoose.Schema({
  title:            {type: String, required: true},
  departureDate:    {type: Date, required: true},
  arrivalDate:      {type: Date, required: true},
  departureAirport: {type: String, required: true},
  arrivalAirport:   {type: String, required: true},
  userId:           {type: mongoose.Schema.ObjectId, ref: 'User'},
  createdAt:        {type: Date, default: Date.now, required: true},

  flight: {
    charge: {
      id:     String,
      amount: Number,
      date:   Date
    },
    itinerary: {
      leaving: [{
        departureAirport: String,
        arrivalAirport:   String,
        airlineCode:      String,
        flightNumber:     Number,
        elapsedTime:      Number
      }],
      returning: [{
        departureAirport: String,
        arrivalAirport:   String,
        airlineCode:      String,
        flightNumber:     Number,
        elapsedTime:      Number
      }]
    }
  }
});

vacationSchema.methods.purchase = function(o, cb) {
  stripe.charges.create({
    amount: o.cost,
    currency: "usd",
    source: o.token,
    description: o.description,
  }, (err, charge) => {
    if (!err) {
      this.flight.charge.id = charge.id;
      this.flight.charge.amount = charge.amount / 100;
      this.flight.charge.date = new Date();
      this.flight.itinerary.leaving = makeItinerary(o.itinerary.OriginDestinationOptions.OriginDestinationOption[0]);
      this.flight.itinerary.returning = makeItinerary(o.itinerary.OriginDestinationOptions.OriginDestinationOption[1]);
      console.log(this);
    }
    cb(err, charge);
  });
};

function makeItinerary(itinerary) {
  var array = [];
  itinerary.FlightSegment.forEach((e)=> {
    array.push({
      departureAirport: e.ArrivalAirport.LocationCode,
      arrivalAirport: e.DepartureAirport.LocationCode,
      airlineCode: e.OperatingAirline.Code,
      flightNumber: e.OperatingAirline.FlightNumber,
      elapsedTime: e.ElapsedTime
    });
  });
  return array;
}

Vacation = mongoose.model('Vacation', vacationSchema);
module.exports = Vacation;
