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

  // Collection for storing user created deliverable
  // set urls according to GET or POST or PUT
  // useful to populate user data inside deliverables
  function deliverablesSetUrls(method, model, options) {
    if(method === 'read') {
      options.url = '/api/v1/deliverables?populate=user';
    } else {
      options.url = '/api/v1/deliverables';
    }
    return Backbone.sync(method, model, options);
  }
  var Deliverables = Backbone.Collection.extend({
    model: J.Models.Deliverable,
    url: '/api/v1/deliverables',
    sync: deliverablesSetUrls,

    // utililty filter functions
    ownDeliverables: function() {
      return this.filter(function(deliverable){
        return deliverable.get('user')._id === J.User._id ? true: false;
      });
    }

  });
  J.Collections.Deliverables= new Deliverables;

})();