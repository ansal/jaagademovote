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