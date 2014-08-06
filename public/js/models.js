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
    idAttribute: '_id',

    // check whether the current user is logged in or not
    // this is for client side goodness only
    // backend api wont allow voting twice or changing a vote
    didIVote: function() {
      // this is a two step process
      // if the user has just voted and the view is re rendering -
      // chances are that the vote may not appear in deliverable model.
      // so an addition check has to be done in vote collection for such cases
      var check1 = _.some(this.get('votes'), function(vote){
        if(vote.user === J.User._id) {
          return true;
        }
      });
      var self = this;
      var check2 = _.some(J.Collections.UserVotes.models, function(vote){
        if(self.get('_id') === vote.get('deliverable') && vote.get('user') === J.User._id) {
          return true;
        }
      });
      if(check1 || check2) {
        return true;
      } else {
        return false;
      }
    },

    whatDidIVote: function() {
      // this is a two step process
      // if the user has just voted and the view is re rendering -
      // chances are that the vote may not appear in deliverable model.
      // so an addition check has to be done in vote collection for such cases
      var i, length, votes;
      for(i = 0, votes = this.get('votes'),length = this.get('votes').length; i < length; i += 1) {
        if(votes[i].user === J.User._id) {
          return votes[i].vote;
        }
      }
      for(i = 0, votes = J.Collections.UserVotes.models,length = J.Collections.UserVotes.models.length; i < length; i += 1) {
        if(votes[i].get('user') === J.User._id) {
          return votes[i].vote;
        }
      }
    },

    // returns number of likes for the deliverables
    // like the above tests, both inside array and vote collection has to be
    // searched
    getLikedCount: function() {
      var liked;
      liked = _.reduce(this.get('votes'), function(sum, vote){
        if(vote.vote === true) {
          return sum + 1;
        } else {
          return sum;
        }
      }, 0);
      liked += _.reduce(J.Collections.UserVotes.models, function(sum, vote){
        if(vote.get('vote') === true) {
          return sum + 1;
        } else {
          return sum;
        }
      }, 0);
      return liked;
    },

    // returns number of hates for the deliverables
    // like the above tests, both inside array and vote collection has to be
    // searched
    getHatedCount: function() {
      var hated;
      hated = _.reduce(this.get('votes'), function(sum, vote){
        if(vote.vote === false) {
          return sum + 1;
        } else {
          return sum;
        }
      }, 0);
      hated += _.reduce(J.Collections.UserVotes.models, function(sum, vote){
        if(vote.get('vote') === false) {
          return sum + 1;
        } else {
          return sum;
        }
      }, 0);
      return hated;
    }

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

  // Model representing individual vote casted by user
  J.Models.UserVote = Backbone.Model.extend({
    idAttribute: '_id'
  });

})();