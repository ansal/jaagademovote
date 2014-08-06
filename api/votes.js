// RESTful api for vote model

var restify = require('./express-restify-mongoose');
var Vote = require('../models/deliverables.js').Vote;
var Deliverable = require('../models/deliverables.js').Deliverable;

// this function should be called in app.js as userRestify(app, config)
module.exports = function(app, config) {

  restify.serve(app, Vote, {

    // only logged in users are allowed
    prereq: function(req, callback) {
      if(req.isAuthenticated()) {

        // post request
        if(req.route.method === 'post') {
          // append user information
          req.body.user = req.user;
          // check whether the user has already voted or not
          Vote.findOne({
            user: req.user._id,
            deliverable: req.body.deliverable
          }, function(err, vote){
            if(err) {
              console.log(err);
              callback(false);
              return;
            }
            console.log(vote)
            // if the vote doesnot exist and is open, let the user vote
            if(!vote) {
              // check whether the deliverable is open for voting
              Deliverable.findOne({
                _id: req.body.deliverable,
                votingopen: true
              }, function(err, deliverable){
                if(err || !deliverable) {
                  console.log(err);
                  callback(false);
                  return;
                }
                callback(true);
                return;    
              });
            }
            else {
              callback(false);
              return;
            }
          });
        }

        // user can only do voting once
        // so no put
        if(req.route.method === 'put') {
            callback(false);
            return;
        }

        // delete is not allowed for voting!
        if(req.route.method === 'delete') {
          callback(false);
          return;
        }

      } else {
        callback(false);
        return;
      }
    },

    contextFilter: function(model, req, callback) {
      // No retrieving is allowed for vote
      // It will be fetched via populating individual votes in 
      // deliverable model
      callback(model.find({
        isPublic: true
      }));
    }

  });

}