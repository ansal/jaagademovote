// Models for JaagaDemoVote app

// global backbone app
var JaagaDemoVote = JaagaDemoVote || {};

(function(){
  'use strict';

  // shortcut
  var J = JaagaDemoVote;

  // Models are stored in Models key
  J.Models = {};

  // Allowed User Model
  // Only admin is allowed to access this
  J.Models.AllowedUser = Backbone.Model.extend({
    defaults: {
      email: 'unknown@example.com'
    },
    idAttribute: '_id'
  });

})();