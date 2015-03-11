'use strict';

var Vacation = require('../../models/vacation');

module.exports = {
  handler: function(request, reply){
    Vacation.find({userId: request.auth.credentials._id}, (err, vacations) => {
      if (err) { reply().code(400); }
      reply({vacations:vacations}).code(200);
    })
  }
};
