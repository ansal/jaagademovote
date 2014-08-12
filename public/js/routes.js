// Routes for JaagaDemoVote app

// global backbone app
var JaagaDemoVote = JaagaDemoVote || {};

(function(){
  'use strict';

  // shortcut
  var J = JaagaDemoVote;

  // app containersb
  // html rendered by backbone views are put into this container
  var $container = $('#appContainer');

  // spinner template
  var spinnerHTML = $('#spinnerTemplate').html();

  J.AppRouter = Backbone.Router.extend({

    routes: {

      // admin only urls
      'app/admin/users': 'adminUsers',
      'app/admin/users/add': 'adminUsersAdd',
      'app/admin/users/view/:id': 'adminUser',

      // urls for all users
      'app/dashboard': 'dashboard',
      'app/deliverables/add': 'userAddDeliverable',
      'app/user/deliverable/view/:id': 'userEditDeliverable',
      'app/user/family/view/:id': 'memberView',
      'app/user/family/deliverable/view/:id': 'memberDeliverableView'

    },

    adminUsers: function() {
      $container.html(spinnerHTML);
      if(J.Collections.AllowedUsers.length !== 0) {
        J.AppState.currentView = new J.Views.AdminUsersView;
        $container.html( J.AppState.currentView.render().$el );
      } else {
        J.Collections.AllowedUsers.fetch({
          success: function() {
            J.AppState.currentView = new J.Views.AdminUsersView;
            $container.html( J.AppState.currentView.render().$el );
          },
          error: function(err) {
            alert('Failed to load data. Please see log for details');
            console.log(err);
          }
        });
      }
    },

    adminUser: function(id) {
      $container.html(spinnerHTML);
      if(J.AppState.currentView) {
        J.AppState.currentView.remove();
      }
      var user = J.Collections.AllowedUsers.get(id);
      // check whether we get a model or not
      // if not, it might be because collection has not been fetched yet
      if(!user) {
        J.Collections.AllowedUsers.fetch({
          success: function() {
            var user = J.Collections.AllowedUsers.get(id);
            J.AppState.currentView = new J.Views.AdminUserView( {model: user} );
            $container.html( J.AppState.currentView.render().$el );
          },
          error: function(err) {
            alert('Failed to load data. Please see log for details');
            console.log(err);
          }
        });
      } else {
        J.AppState.currentView = new J.Views.AdminUserView( {model: user} );
        $container.html( J.AppState.currentView.render().$el );
      }
    },

    adminUsersAdd: function() {
      $container.html(spinnerHTML);
      if(J.AppState.currentView) {
        J.AppState.currentView.remove();
      }
      J.AppState.currentView = new J.Views.AdminUserAddView;
      $container.html( J.AppState.currentView.render().$el );
    },

    dashboard: function() {
      $container.html(spinnerHTML);
      if(J.AppState.currentView) {
        J.AppState.currentView.remove();
      }
      // Fetch all collections before loading
      // This is an antipattern as described in Backbone FAQ
      // But for the time being Models are not bootstrapped by
      // the backend.
      if(J.Collections.Deliverables.length !== 0) {
        J.AppState.currentView = new J.Views.UserDashboardView;
        $container.html( J.AppState.currentView.render().$el );
      } else {
        J.Collections.Deliverables.fetch({
          success: function() {
            // Since dashboard also shows family members,
            // we have to show them too
            J.Collections.Family.fetch({
              success: function() {
                J.AppState.currentView = new J.Views.UserDashboardView;
                $container.html( J.AppState.currentView.render().$el );
              },
              error: function() {
                alert('Failed to load data. Please see log for details');
                console.log(err);
              }
            });
          },
          error: function(err) {
            alert('Failed to load data. Please see log for details');
            console.log(err);
          }
        });
      }
    },

    userAddDeliverable: function() {
      $container.html(spinnerHTML);
      if(J.AppState.currentView) {
        J.AppState.currentView.remove();
      }
      J.AppState.currentView = new J.Views.UserAddDeliverableView;
      $container.html( J.AppState.currentView.render().$el );
    },

    userEditDeliverable: function(id) {
      $container.html(spinnerHTML);
      if(J.AppState.currentView) {
        J.AppState.currentView.remove();
      }
      var deliverable = J.Collections.Deliverables.get(id);
      // check whether we get a model or not
      // if not, it might be because collection has not been fetched yet
      if(!deliverable) {
        J.Collections.Deliverables.fetch({
          success: function() {
            var deliverable = J.Collections.Deliverables.get(id);
            J.AppState.currentView = new J.Views.UserEditDeliverableView( {model: deliverable} );
            $container.html( J.AppState.currentView.render().$el );
          },
          error: function(err) {
            alert('Failed to load data. Please see log for details');
            console.log(err);
          }
        });
      } else {
        J.AppState.currentView = new J.Views.UserEditDeliverableView( {model: deliverable} );
        $container.html( J.AppState.currentView.render().$el );
      }
    },

    memberView: function(id) {
      $container.html(spinnerHTML);
      if(J.AppState.currentView) {
        J.AppState.currentView.remove();
      }
      var member = J.Collections.Family.get(id);
      // check whether we get a model or not
      // if not, it might be because collection has not been fetched yet
      if(!member) {
        J.Collections.Family.fetch({
          success: function() {
            var member = J.Collections.Family.get(id);
            J.AppState.currentView = new J.Views.MemberView( {model: member} );
            $container.html( J.AppState.currentView.render().$el );
          },
          error: function(err) {
            alert('Failed to load data. Please see log for details');
            console.log(err);
          }
        });
      } else {
        J.AppState.currentView = new J.Views.MemberView( {model: member} );
        $container.html( J.AppState.currentView.render().$el );
      }
    },

    memberDeliverableView: function(id) {
      $container.html(spinnerHTML);
      if(J.AppState.currentView) {
        J.AppState.currentView.remove();
      }
      var deliverable = J.Collections.Deliverables.get(id);
      // check whether we get a model or not
      // if not, it might be because collection has not been fetched yet
      if(!deliverable) {
        J.Collections.Deliverables.fetch({
          success: function() {
            var deliverable = J.Collections.Deliverables.get(id);
            J.AppState.currentView = new J.Views.MemberDeliverableView( {model: deliverable} );
            $container.html( J.AppState.currentView.render().$el );
          },
          error: function(err) {
            alert('Failed to load data. Please see log for details');
            console.log(err);
          }
        });
      } else {
        J.AppState.currentView = new J.Views.MemberDeliverableView( {model: deliverable} );
        $container.html( J.AppState.currentView.render().$el );
      }
    }

  });

})();