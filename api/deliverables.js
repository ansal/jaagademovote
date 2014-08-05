// RESTful api for deliverable model

var restify = require('express-restify-mongoose');
var Deliverable = require('../models/deliverables.js').Deliverable;

// this function should be called in app.js as userRestify(app, config)
module.exports = function(app, config) {

  restify.serve(app, Deliverable, {

    // only logged in users are allowed
    prereq: function(req) {
      if(req.isAuthenticated()) {
        // append user information
        req.body.user = req.user;
        // when creating for the first time, all are undelivered
        req.body.delivered = false;
        return true;
      } else {
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