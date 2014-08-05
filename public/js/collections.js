// Collections for JaagaDemoVote app

// global backbone app
var JaagaDemoVote = JaagaDemoVote || {};

(function(){
  'use strict';

  // shortcut
  var J = JaagaDemoVote;

  // Collections are stored in Collections key
  J.Collections = {};

  // Collection for storing AllowedUser
  // Only admin is allowed to access this
  var AllowedUsers = Backbone.Collection.extend({
    model: J.Models.AllowedUser,
    url: '/api/v1/allowedusers'
  });

  J.Collections.AllowedUsers = new AllowedUsers;

})();