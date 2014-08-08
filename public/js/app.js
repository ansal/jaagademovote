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

  // Go to dashboard first if no other backbone URL is requested
  var href = window.location;
  if(href.hash === '') {
    window.location.href = '#/app/dashboard';
  }

  // Just for some goodness, a list of some of my favourite quotes
  J.Quotes= [
    'Happiness is Only Real When Shared, Christopher Mccandles.',
    'Some people feel like they don\'t deserve love. They walk away quietly into empty spaces, trying to close the gaps of the past, Christopher Mccandles.',
    'I read somewhere... how important it is in life not necessarily to be strong, but to feel strong... to measure yourself at least once, Christopher Mccandles.',
    'The core of mans\' spirit comes from new experiences, Leo Tolstoy',
    'There is a saying in Tibetan, \'Tragedy should be utilized as a source of strength.\' No matter what sort of difficulties, how painful experience is, if we lose our hope, that\'s our real disaster, HH Dalai Lama 14th',
    'The secret of health for both mind and body is not to mourn for the past, nor to worry about the future, but to live the present moment wisely and earnestly, Gautama Buddha',
    'How can one be well...when one suffers morally? Leo Tolstoy',
    'Suffering has been stronger than all other teaching, and has taught me to understand what your heart used to be. I have been bent and broken, but - I hope - into a better shape, Charles Dickens',
    '“And O there are days in this life, worth life and worth death, Charles Dickens'
  ];
  // show the quotes
  function randomInt(min, max) {
      return Math.floor( Math.random()*(max-min+1) + min );
  }
  var index = randomInt(0, J.Quotes.length - 1);
  $('#quoteRow').hide();
  $('#quoteArea').text( '"' + J.Quotes[index] + '"' );
  $('#quoteRow').show('fast');

})();