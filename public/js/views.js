// Views for JaagaDemoVote app

// global backbone app
var JaagaDemoVote = JaagaDemoVote || {};

(function(){
  'use strict';

  // shortcut
  var J = JaagaDemoVote;

  // Views are stored in Views keys
  J.Views = {};

  // Admin related views

  // User listing view for admin
  J.Views.AdminUsersView = Backbone.View.extend({

    tagName: 'div',
    className: 'col-md-offset-2 col-md-8 tile',
    template: _.template( $('#adminUsersTemplate').html() ),

    render: function() {
      var html = this.template({
        users: J.Collections.AllowedUsers.models
      });
      this.$el.html(html);
      return this;
    }

  });

  // View for adding users. Only for admin
  J.Views.AdminUserAddView = Backbone.View.extend({

    tagName: 'div',
    className: 'col-md-offset-2 col-md-8 tile',
    template: _.template( $('#adminUserAddTemplate').html() ),

    events: {
      'click #newUserEmailSaveButton': 'saveNewUser'
    },

    render: function() {
      var html = this.template({
      });
      this.$el.html(html);
      return this;
    },

    saveNewUser: function(e) {
      e.preventDefault();

      var email = $('#newUserEmail').val();
      if(!email) {
        $('#emailVaildationError').show('fast');
        return;
      }

      J.Collections.AllowedUsers.create({
        email: email
      });

      window.location.href = '#/app/admin/users';

    }

  });

  // View for viewing/deleting a user. Only for admin.
  J.Views.AdminUserView = Backbone.View.extend({

    tagName: 'div',
    className: 'col-md-offset-2 col-md-8 tile',
    template: _.template( $('#adminUserTemplate').html() ),

    events: {
      'click #removeUserButton': 'removeUser'
    },

    render: function() {
      var html = this.template({
        user: this.model
      });
      this.$el.html(html);
      return this;
    },

    removeUser: function(e) {
      e.preventDefault();
      var confirmation = window.confirm('There is no going back. Are you sure?');
      if(!confirmation) {
        return;
      }
      this.model.destroy();
      window.location.href = '#/app/admin/users';
    }

  });

  // Views for all users

  // Dashboard view
  J.Views.UserDashboardView = Backbone.View.extend({

    tagName: 'div',
    className: 'col-md-offset-2 col-md-8 tile',
    template: _.template( $('#userDashboardTemplate').html() ),

    render: function() {
      var html = this.template({
        deliverables: J.Collections.Deliverables.ownDeliverables(),
        members: J.Collections.Family.models
      });
      this.$el.html(html);
      return this;
    }

  });

  // View for adding a deliverable
  J.Views.UserAddDeliverableView = Backbone.View.extend({

    tagName: 'div',
    className: 'col-md-offset-2 col-md-8 tile',
    template: _.template( $('#userAddDeliverableTemplate').html() ),

    events: {
      'click #newDeliverableSaveButton': 'saveNewDeliverable'
    },

    render: function() {
      var html = this.template({
      });
      this.$el.html(html);
      return this;
    },

    saveNewDeliverable: function(e) {
      e.preventDefault();
      $(e.target).attr('disabled', true);
      $(e.target).html('Please wait...');
      var title = $('#deliverableTitle').val(),
          description = $('#deliverableDescription').val();

      if(!title || !description) {
        $('#validationError').show('fast');
        $(e.target).attr('disabled', false);
        $(e.target).html('Create');
        return;
      }

      J.Collections.Deliverables.create({
        title: title,
        description: description
      }, {
        wait: false,
        success: function() {
          window.location.href = '#/app/dashboard';
        },
        error: function() {
          $(e.target).attr('disabled', false);
          $(e.target).html('Create');
        }
      });

    }

  });

  // Edit a deliverable
  J.Views.UserEditDeliverableView = Backbone.View.extend({

    tagName: 'div',
    className: 'col-md-offset-2 col-md-8 tile',
    template: _.template( $('#userEditDeliverableTemplate').html() ),

    events: {
      'click #deliverableUpdateButton': 'updateDeliverable',
      'click #deliverableDeleteButton': 'removeDeliverable'
    },

    render: function() {
      var html = this.template({
        deliverable: this.model
      });
      this.$el.html(html);
      return this;
    },

    updateDeliverable: function(e) {
      e.preventDefault();

      var title = $('#deliverableTitle').val(),
          description = $('#deliverableDescription').val();

      if(!title || !description) {
        $('#validationError').show('fast');
        return;
      }

      this.model.set('title', title);
      this.model.set('description', description);
      this.model.save();

      window.location.href = '#/app/dashboard';

    },

    removeDeliverable: function(e) {
      e.preventDefault();
      var confirmation = window.confirm('There is no going back. Are you sure?');
      if(!confirmation) {
        return;
      }
      this.model.destroy();
      window.location.href = '#/app/dashboard';
    }

  });

  // Individual family member view
  J.Views.MemberView = Backbone.View.extend({

    tagName: 'div',
    className: 'col-md-offset-2 col-md-8 tile',
    template: _.template( $('#memberView').html() ),

    render: function() {
      var html = this.template({
        member: this.model
      });
      this.$el.html(html);
      return this;
    }

  });

  // Member deliverable view for other users
  J.Views.MemberDeliverableView = Backbone.View.extend({

    tagName: 'div',
    className: 'col-md-offset-2 col-md-8 tile',
    template: _.template( $('#memberDeliverableView').html() ),

    events: {
      'click #openVoteButton': 'openVoting',
      'click #closeVoteButton': 'closeVoting',
      'click #voteUp': 'voteUp',
      'click #voteDown': 'voteDown',
      'click #completeDeliverableButton': 'completeDeliverable',
    },

    initialize: function() {
      
    },

    render: function() {
      var html = this.template({
        deliverable: this.model
      });
      this.$el.html(html);
      return this;
    },

    // open voting. only for admins
    openVoting: function(e) {
      e.preventDefault();
      $(e.target).attr('disabled', true);
      this.model.set('votingopen', true);
      this.model.save({
        'votingopen': true
      }, {
        success: function() {
          window.location.reload();
        }
      });
    },

    // close voting. only for admins
    closeVoting: function(e) {
      e.preventDefault();
      $(e.target).attr('disabled', true);
      this.model.set('votingopen', false);
      this.model.save({
        'votingopen': false
      }, {
        success: function() {
          window.location.reload();
        }
      });;
    },

    // mark deliverable as completed. only for admins
    completeDeliverable: function(e) {
      e.preventDefault();
      $(e.target).attr('disabled', true);
      this.model.set('delivered', true);
      this.model.save({
        'delivered': true
      }, {
        success: function() {
          window.location.reload();
        }
      });
    },    

    // voting available for all users
    voteUp: function(e) {
      e.preventDefault();
      $('.votingButton').attr('disabled', true);
      J.Collections.UserVotes.create({
        deliverable: this.model.get('_id'),
        vote: true,
        // Dont worry about this. API will make sure that
        // only the logged in user info will be saved.
        // This is for quick client side updation
        user: J.User._id
      }, {
        wait: true,
        success: function() {
          window.location.reload();
        },
        error: function() {
          $('.votingButton').attr('disabled', false);
          window.alert('Unable to process this request!');
        }
      });
    },

    voteDown: function(e) {
      e.preventDefault();
      $('.votingButton').attr('disabled', true);
      $(e.target).attr('disabled', true);
      J.Collections.UserVotes.create({
        deliverable: this.model.get('_id'),
        vote: false,
        // Dont worry about this. API will make sure that
        // only the logged in user info will be saved.
        // This is for quick client side updation
        user: J.User._id
      }, {
        wait: true,
        success: function() {
          window.location.reload();
        },
        error: function() {
          $('.votingButton').attr('disabled', false);
          window.alert('Unable to process this request!');
        }
      });
    }    

  });

})();