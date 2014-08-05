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

      // admin urls
      'app/admin/users': 'adminUsers',
      'app/admin/users/add': 'adminUsersAdd',
      'app/admin/users/view/:id': 'adminUser'

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
    }

  });

})();