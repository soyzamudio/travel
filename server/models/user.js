/* jshint camelcase:false */

'use strict';

let bcrypt = require('bcrypt');
let mongoose = require('mongoose');
let Request = require('request');
let qs = require('querystring');
let jwt = require('jwt-simple');
let moment = require('moment');
let User;

let userSchema = mongoose.Schema({
  displayName: String,
  photoUrl:    String,
  github:      String,
  facebook:    String,
  linkedin:    String,
  twitter:     String,
  createdAt:   {type: Date, default: Date.now, required: true}
});

userSchema.statics.github = function(payload, cb) {
  let accessTokenUrl = 'https://github.com/login/oauth/access_token';
  let userApiUrl = 'https://api.github.com/user';
  let params = {
    code:          payload.code,
    client_id:     payload.clientId,
    redirect_uri:  payload.redirectUri,
    client_secret: process.env.GITHUB_SECRET
  };

  Request.get({url: accessTokenUrl, qs: params}, (err, response, accessToken) => {
    let headers = {'User-Agent':'Satellizer'};
    accessToken = qs.parse(accessToken);
    Request.get({url: userApiUrl, qs: accessToken, headers: headers, json:true}, (err, response, profile) => {
      cb({ github: profile.id, displayName: profile.name, photoUrl: profile.avatar_url });
    });
  });
};

userSchema.statics.facebook = function(payload, cb) {
  let accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
  let graphApiUrl = 'https://graph.facebook.com/me';
  let params = {
    code: payload.code,
    client_id: payload.clientId,
    client_secret: process.env.FACEBOOK_SECRET,
    redirect_uri: payload.redirectUri
  };

  Request.get({url: accessTokenUrl, qs: params, json: true}, (err, response, accessToken) => {
    console.log(accessToken);
    accessToken = qs.parse(accessToken);
    Request.get({url: graphApiUrl, qs: accessToken, json: true}, (err, response, profile) => {
      cb({ facebook: profile.id, displayName: profile.name, photoUrl: `https://graph.facebook.com/${profile.id}/picture?type=large`});
    });
  });
};

userSchema.statics.linkedin = function(payload, cb) {
  let accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
  let peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
  let params = {
    code: payload.code,
    client_id: payload.clientId,
    client_secret: process.env.LINKEDIN_SECRET,
    redirect_uri: payload.redirectUri,
    grant_type: 'authorization_code'
  };

  Request.post(accessTokenUrl, {form: params, json:true}, (err, response, accessToken) => {
    let params = {
      oauth2_access_token: accessToken.access_token,
      format: 'json'
    };

    Request.get({url: peopleApiUrl, qs: params, json: true}, (err, response, profile) => {
      cb({ linkedin: profile.id, displayName: `${profile.firstName} ${profile.lastName}`, photoUrl: profile.pictureUrl});
    });
  });
};

userSchema.statics.preTwitter = function(cb){
  let requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  let authenticateUrl = 'https://api.twitter.com/oauth/authenticate';
  let requestTokenOauth = {
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    callback: 'http://127.0.0.1:3333/auth/twitter'
  };

    Request.post({url:requestTokenUrl, oauth:requestTokenOauth}, (err, response, body)=>{
      let oauthToken = qs.parse(body);
      let params = qs.stringify({oauth_token:oauthToken.oauth_token});
      cb(authenticateUrl + '?' + params);
    });
};

userSchema.statics.twitter = function(query, cb){
  let accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  let accessTokenOauth = {
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    token: query.oauth_token,
    verifier: query.oauth_verifier
  };

  Request.post({url:accessTokenUrl, oauth:accessTokenOauth}, (err, response, profile)=>{
    profile = qs.parse(profile);
    cb({twitter:profile.user_id, displayName:profile.screen_name});
  });
};

userSchema.statics.create = function(provider, profile, cb) {
  let query = {};
  query[provider] = profile[provider];
  User.findOne(query, (err, user) => {
    if (user) { return cb(err, user); }
    let u = new User(profile);
    u.save(cb);
  });
};

userSchema.methods.token = function() {
  let payload = {
    sub: this._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };

  return jwt.encode(payload, process.env.TOKEN_SECRET);
};

userSchema.statics.register = function(o, cb){
  User.findOne({email:o.email}, function(err, user){
    if(user){return cb(true);}

    user = new User(o);
    user.password = bcrypt.hashSync(o.password, 8);
    user.save(cb);
  });
};

userSchema.statics.authenticate = function(o, cb){
  User.findOne({email:o.email}, function(err, user){
    if (!user) {return cb(true);}

    let isGood = bcrypt.compareSync(o.password, user.password);
    if (!isGood) {return cb(true);}

    cb(null, user);
  });
};

User = mongoose.model('User', userSchema);
module.exports = User;
