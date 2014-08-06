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
  date: { type: Date, default: Date.now }
});
module.exports.Deliverable = mongoose.model('Deliverable', DeliverableSchema);

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