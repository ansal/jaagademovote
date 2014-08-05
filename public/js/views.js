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
    className: 'col-md-offset-2 col-md-8',
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
    className: 'col-md-offset-2 col-md-8',
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
    className: 'col-md-offset-2 col-md-8',
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
    className: 'col-md-offset-2 col-md-8',
    template: _.template( $('#userDashboardTemplate').html() ),

    render: function() {
      var html = this.template({
        deliverables: J.Collections.Deliverables.ownDeliverables()
      });
      this.$el.html(html);
      return this;
    }

  });

  // View for adding a deliverable
  J.Views.UserAddDeliverableView = Backbone.View.extend({

    tagName: 'div',
    className: 'col-md-offset-2 col-md-8',
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

      var title = $('#deliverableTitle').val(),
          description = $('#deliverableDescription').val();

      if(!title || !description) {
        $('#validationError').show('fast');
        return;
      }

      J.Collections.Deliverables.create({
        title: title,
        description: description
      });

      window.location.href = '#/app/dashboard';

    }

  });

  // Edit a deliverable
  J.Views.UserEditDeliverableView = Backbone.View.extend({

    tagName: 'div',
    className: 'col-md-offset-2 col-md-8',
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

})();