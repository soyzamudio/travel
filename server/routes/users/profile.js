'use strict';

var User = require('../../models/user');

module.exports = {
  handler: function(request, reply) {
    User.findById(request.auth.credentials._id, (err, user) => {
      user.phone = request.payload.phone;
      user.update(err => {
        if (err) { reply().code(400); }
        reply({user:user}).code(200);
      });
    });
  }
};
