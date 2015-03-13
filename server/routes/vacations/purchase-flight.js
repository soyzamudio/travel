'use strict';

let Vacation = require('../../models/vacation');
let Text = require('../../models/text');

module.exports = {
  handler: function(request, reply){
    Vacation.findById(request.params.vacationId, (err, vacation) => {
      vacation.purchase(request.payload, (err, charge) => {
        if (err) { return reply().code(400); }
        Text.send(request.auth.credentials.phone, `Congrats, you purchased a flight for $${vacation.flight.charge.amount.toFixed(2)}!`, (err, message) => {
          console.log('Message', message);
          console.log('Error', err);
          vacation.save(() => {
            reply(vacation);
          });
        })
      });
    });
  }
};
