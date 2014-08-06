// A simple authorization strategy for Android

// required modules
var googleIdToken = require('google-id-token');

var getGoogleCerts = require('../auth.js').getGoogleCerts;

// authenticate an android request against a authorization token
exports.authAndroid = function(req, res) {

  if(typeof req.headers.authorization === 'undefined') {
    res.json(403);
    return;
  }

  var parser = new googleIdToken({ getKeys: getGoogleCerts });

  parser.decode(req.headers.authorization, function(err, token) {
    if(err) {
        console.log("Error: " + err);
        res.json(403);
        return;
    }

    res.json(token);

  });

}