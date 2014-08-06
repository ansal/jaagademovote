// RESTful api for user model

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
        callback(model.find({
          isPublic: true
        }));
        return;
      }

      callback(model.find().populate('deliverables'));

    }

  });

}