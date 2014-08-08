// RESTful api for user model

var googleIdToken = require('google-id-token');

var getGoogleCerts = require('../auth.js').getGoogleCerts;
var restify = require('./express-restify-mongoose.js');
var User = require('../models/user.js');

// this function should be called in app.js as userRestify(app, config)
module.exports = function(app, config) {

  restify.serve(app, User, {

    name: 'family',
    plural: false,

    // Nothing except GET
    prereq: function(req) {
      return false;
    },

    contextFilter: function(model, req, callback) {

      if(!req.user) {

        // check whether the request is coming from android
        if(typeof req.headers.authorization === 'undefined') {
          callback(model.find({
            isPublic: true
          }));
          return;
        } else{
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
            callback(model.find().populate('deliverables'));            
            return;
          });
        }
        return;
      } else {
        callback(model.find().populate('deliverables'));
        return;
      }

    }

  });

}