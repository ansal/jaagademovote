// user model used by all oauth providers

var mongoose = require('mongoose')
  ,Schema = mongoose.Schema
  ,ObjectId = Schema.ObjectId;

var User = require('./user.js');

// A deliverable created by the user
var DeliverableSchema = new Schema({
  user: { type: ObjectId, ref: 'User' },
  title: String,
  description: String,
  delivered: { type: Boolean, default: false},
  votingopen: { type: Boolean, default: false},
  votes: [{ type: ObjectId, ref: 'Vote' }],
  date: { type: Date, default: Date.now },
  delivereddate: Date
});
var Deliverable = mongoose.model('Deliverable', DeliverableSchema);
module.exports.Deliverable = Deliverable;

// post save signal to save a reference in user model
DeliverableSchema.post('save', function (deliverable) {
  User.findOne({
    _id: deliverable.user
  }, function(err, user){
    if(err) {
      console.log(err);
      return;
    }
    if(!user) {
      // TODO: Should the deliverable be deleted in case user is not found?
      return;
    }
    if(user.deliverables.indexOf(deliverable._id) === -1) {
      user.deliverables.push(deliverable._id);
      user.save(function(err){
        if(err) {
          console.log(err);
          return;
        }
      });
    }
  });
})

// A vote casted by the user
var VoteSchema = new Schema({
  user: { type: ObjectId, ref: 'User' },
  deliverable: { type: ObjectId, ref: 'Deliverable' },
  vote: Boolean,
  date: { type: Date, default: Date.now }
});
module.exports.Vote = mongoose.model('Vote', VoteSchema);

// post save signal to save a reference in deliverable model
VoteSchema.post('save', function (vote) {
  Deliverable.findOne({
    _id: vote.deliverable
  }, function(err, deliverable){
    if(err) {
      console.log(err);
      return;
    }
    if(!deliverable) {
      // TODO: Should the deliverable be deleted in case deliverable is not found?
      return;
    }
    // save only if user hasn't voted already
    if(deliverable.votes.indexOf(vote._id) === -1) {
      deliverable.votes.push(vote._id);
      deliverable.save(function(err){
        if(err) {
          console.log(err);
          return;
        }
      });
    }
  });
})