// RESTful api for deliverable model

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
          console.log('post called')
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
          console.log('put or delete called');
          Deliverable.findOne({
            'user': req.user._id,
            _id: req.params.id
          }, function(err, deliverable){

            if(err) {
              console.log(err);
              callback(false);
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
      } else {
        callback(model.find({
          isPublic: true
        }));
      }
    }

  });

}