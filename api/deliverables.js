// RESTful api for deliverable model

var googleIdToken = require('google-id-token');

var getGoogleCerts = require('../auth.js').getGoogleCerts;
var restify = require('./express-restify-mongoose');
var Deliverable = require('../models/deliverables.js').Deliverable;

// this function should be called in app.js as userRestify(app, config)
module.exports = function(app, config) {

  restify.serve(app, Deliverable, {

    // only logged in users are allowed
    prereq: function(req, callback) {
      if(req.isAuthenticated()) {

        // post request
        if(req.route.method === 'post') {
          // append user information
          req.body.user = req.user;
          // when creating for the first time, all are undelivered
          req.body.delivered = false;
          callback(true);
          return;
        }

        // put and delete needs to be checked if the request 
        // is coming from the owner of the document
        if(req.route.method === 'put' || req.route.method === 'delete') {
          Deliverable.findOne({
            'user': req.user._id,
            _id: req.params.id
          }, function(err, deliverable){

            if(err) {
              console.log(err);
              callback(false);
              return;
            }

            // check whether the user is an admin trying to open/close the voting
            if(config.admins.indexOf(req.user.email) !== -1) {
              callback(true);
              return;
            }

            if(!deliverable) {
              callback(false);
              return;
            }

            // user is the right one
            // if its a put method, update user as a last check
            if(req.route.method === 'put') {
              req.body.user = req.user;
              // user has no right to mark project as completed
              req.body.delivered = false;
            }
            callback(true);
            return;
          });
        }


      } else {
        callback(false);
        return false;
      }
    },

    contextFilter: function(model, req, callback) {
      
      if(req.user) {
        
        callback(model);
        return;

      } else {
        
        // check whether the request is coming from android
        if(typeof req.headers.authorization === 'undefined') {

          callback(model.find({
            isPublic: true
          }));
          return;

        } else {

          // this is an android call, parse it
          var parser = new googleIdToken({ getKeys: getGoogleCerts });

          parser.decode(req.headers.authorization, function(err, token) {
            if(err) {
                console.log("Error: " + err);
                callback(model.find({
                  isPublic: true
                }));
                return;
            }

            // this is a valid user
            callback(model);            
            return;
          });

        }

        return;

      }
    }

  });

}