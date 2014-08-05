// Express routes
var config = require('../config.js');

exports.index = function(req, res){
  
  if(!req.user) {
    res.render('index');
    return;
  }

  if( config.admins.indexOf(req.user.email) !== -1 ) {
    req.user.isAdmin = true;
  } else {
    req.user.isAdmin = false;
  }

  // user is logged in
  res.render('user', {
    user: req.user,
    userInfo: JSON.stringify(req.user)
  });

};

// logouts a user
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/?loggedOut=true');
};