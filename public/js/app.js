// JaagaDemoVote app

// global backbone app
var JaagaDemoVote = JaagaDemoVote || {};

(function(){
  'use strict';

  // shortcut
  var J = JaagaDemoVote;

  // App state to hold app state information like current view etc
  J.AppState = {};

  // start backbone routing
  J.Router = new J.AppRouter;
  Backbone.history.start();

})();