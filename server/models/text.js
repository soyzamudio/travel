'use strict';

let client = require('twilio')(process.env.TWILIO_PUBLIC_KEY, process.env.TWILIO_SECRET_KEY);

class Text {
  static send(to, body, cb) {
    client.messages.create({
      body: body,
      to:   to,
      from: '+14158861160'
    }, cb);
  }
}

module.exports = Text;
