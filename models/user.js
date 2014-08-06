// user model used by all oauth providers

var mongoose = require('mongoose')
  ,Schema = mongoose.Schema
  ,ObjectId = Schema.ObjectId;

// User model used by PassportJS for authentication
var UserSchema = new Schema({
  name: String,
  email: String,
  username: String,
  provider: String,
  google: {},
  facebook: {},
  twitter: {},
  // reverse reference to deliverables
  // saved through post save signal callback
  deliverables: [
    { type: ObjectId, ref: 'Deliverable' }
  ]
});

// List of users allowed to login and vote
// only admin has access to this
var AllowedUserSchema = new Schema({
  email: String
});

module.exports.UserSchema = UserSchema; 
module.exports = mongoose.model('User', UserSchema);
module.exports.AllowedUser = mongoose.model('AllowedUser', AllowedUserSchema);