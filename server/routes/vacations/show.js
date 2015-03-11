'use strict';

var Vacation = require('../../models/vacation');

module.exports = {
  handler: function(request, reply){
    console.log('Show.js | vacationId', request.params.vacationId);
    Vacation.findOne({_id: request.params.vacationId}, (err, vacation) => {
      if (err) { reply().code(400); }
      reply({vacation:vacation}).code(200);
    }); w
  }
};
