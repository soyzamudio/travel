'use strict';

let Vacation = require('../../models/vacation');

module.exports = {
  handler: function(request, reply){
    Vacation.findById(request.params.vacationId, (err, vacation) => {
      vacation.purchase(request.payload, (err, charge) => {
        if (err) { return reply().code(400); }
        vacation.save(() => {
          reply(vacation);
        });
      });
    });
  }
};
