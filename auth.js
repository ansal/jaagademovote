// Authentication functions for PassportJS

// Passport oauth modules
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('./models/user.js');

module.exports = function(passport, config) {

  // general passport setup
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // Google oAuth login
  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
  },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({'google.id': profile.id}, function(err, user){
        if(err) { console.log(err); }
        // create a new user account if she doesnot exist
        if(!user) {
          var user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'google',
            google: profile._json
          });
          user.save(function(err){
            if(err) { console.log(err); }
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));

  // Facebook oAuth login
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
  },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile)
      User.findOne({'facebook.id': profile.id}, function(err, user){
        if(err) { console.log(err); }
        // create a new user account if she doesnot exist
        if(!user) {
          var user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'facebook',
            facebook: profile._json
          });
          user.save(function(err){
            if(err) { console.log(err); }
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));

  // Twitter oAuth login
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
  },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile)
      User.findOne({'twitter.id': profile.id}, function(err, user){
        if(err) { console.log(err); }
        // create a new user account if she doesnot exist
        if(!user) {
          var user = new User({
            name: profile.displayName,
            username: profile.username,
            provider: 'twitter',
            twitter: profile._json
          });
          user.save(function(err){
            if(err) { console.log(err); }
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));

};