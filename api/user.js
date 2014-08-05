// RESTful api for user model

var restify = require('express-restify-mongoose');
var AllowedUser = require('../models/user.js').AllowedUser;

// this function should be called in app.js as userRestify(app, config)
module.exports = function(app, config) {

  restify.serve(app, AllowedUser, {

    // only admin is allowed for all type of requests except GET
    prereq: function(req) {
      console.log('\n\nprereq called!!!\n\n')
      if(req.isAuthenticated()) {
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