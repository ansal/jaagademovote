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

  // User created deliverables
  J.Models.Deliverable = Backbone.Model.extend({
    defaults: {
      title: 'Untitled Deliverable',
      description: 'No description given'
    },
    idAttribute: '_id'
  });

  // Family Member model
  // This holds all user info added by the user
  // There is no way to add, update and delete this -
  // even for admin
  J.Models.FamilyMember = Backbone.Model.extend({
    idAttribute: '_id',

    // returns number of completed deliverables
    getCompletedDeliverableCount: function() {
      return _.reduce(this.get('deliverables'), function(sum, d){
        var delivered = d.delivered === true ? 1 : 0;
        return sum + delivered;
      }, 0);
    },

    // returns number of upcoming deliverables
    getUpcomingDeliverableCount: function() {
      return _.reduce(this.get('deliverables'), function(sum, d){
        var delivered = d.delivered === false ? 1 : 0;
        return sum + delivered;
      }, 0);
    },

    // returns all completed deliverables
    getCompletedDeliverables: function() {
      return _.filter(this.get('deliverables'), function(d){
        return d.delivered;
      });
    },

    // returns all upcoming deliverables
    getUpcomingDeliverables: function() {
      return _.filter(this.get('deliverables'), function(d){
        return !d.delivered;
      });
    }

  });

})();