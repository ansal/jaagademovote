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

  J.AppRouter = Backbone.Router.extend({

    routes: {

      // admin only urls
      'app/admin/users': 'adminUsers',
      'app/admin/users/add': 'adminUsersAdd',
      'app/admin/users/view/:id': 'adminUser',

      // urls for all users
      'app/dashboard': 'dashboard',
      'app/deliverables/add': 'userAddDeliverable',
      'app/user/deliverable/view/:id': 'userEditDeliverable'

    },

    adminUsers: function() {
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
    },

    adminUser: function(id) {
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
      if(J.AppState.currentView) {
        J.AppState.currentView.remove();
      }
      J.AppState.currentView = new J.Views.AdminUserAddView;
      $container.html( J.AppState.currentView.render().$el );
    },

    dashboard: function() {
      if(J.AppState.currentView) {
        J.AppState.currentView.remove();
      }
      // Fetch all collections before loading
      // This is an antipattern as described in Backbone FAQ
      // But for the time being Models are not bootstrapped by
      // the backend.
      J.Collections.Deliverables.fetch({
        success: function() {
          J.AppState.currentView = new J.Views.UserDashboardView;
          $container.html( J.AppState.currentView.render().$el );
        },
        error: function(err) {
          alert('Failed to load data. Please see log for details');
          console.log(err);
        }
      });
    },

    userAddDeliverable: function() {
      if(J.AppState.currentView) {
        J.AppState.currentView.remove();
      }
      J.AppState.currentView = new J.Views.UserAddDeliverableView;
      $container.html( J.AppState.currentView.render().$el );
    },

    userEditDeliverable: function(id) {
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
    }

  });

})();