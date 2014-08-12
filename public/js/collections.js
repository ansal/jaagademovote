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
    comparator: function( collection ){
      return( collection.get( 'email' ) );
    },
    url: '/api/v1/allowedusers'
  });
  J.Collections.AllowedUsers = new AllowedUsers;

  // Collection for storing user created deliverable
  // set urls according to GET or POST or PUT
  // useful to populate user data inside deliverables
  function deliverablesSetUrls(method, model, options) {
    if(method === 'read') {
      options.url = '/api/v1/deliverables?populate=user,votes';
    } else {
      options.url = '/api/v1/deliverables';
    }
    return Backbone.sync(method, model, options);
  }
  var Deliverables = Backbone.Collection.extend({
    model: J.Models.Deliverable,
    comparator: function( collection ){
      return( collection.get( 'name' ) );
    },
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

  // Collection for holding all family members
  var Family = Backbone.Collection.extend({
    model: J.Models.FamilyMember,
    url: '/api/v1/family',

    // get all the family members without the user
    getMembersWithoutMe: function() {
      return this.filter(function(member){
        return member.get('_id') === J.User._id ? false: true;
      });
    },

    getMemberDeliverableCount: function(id) {
      if(!id) {
        throw new Error('getMemberDeliverableCount needs a member id');
      }
      var member = J.Collections.Family.get(id);
      if(!member) {
        return null;
      }
      return _.reduce(member.get('deliverables'), function(sum, d){
        var delivered = d.delivered === true ? 1 : 0;
        return sum + delivered;
      }, 0);
    }
  });
  J.Collections.Family = new Family;

  // Collection representing a UserVote
  // Dont try to fetch this as it will load
  // tons of data!
  var UserVotes = Backbone.Collection.extend({
    model: J.Models.UserVote,
    url: '/api/v1/votes'
  });
  J.Collections.UserVotes = new UserVotes;

})();