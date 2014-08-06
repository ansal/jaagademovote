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

  // This fix isAdmin missing in client side
  // TODO: This is a lame solution
  // Find a clean solution
  var userInfo = req.user;
  userInfo = JSON.stringify(userInfo);
  userInfo = JSON.parse(userInfo);
  if(req.user.isAdmin) {
    userInfo.isAdmin = true;
  } else {
    userInfo.isAdmin = false;
  }
  userInfo = JSON.stringify(userInfo);

  // user is logged in
  res.render('user', {
    user: req.user,
    userInfo: userInfo
  });

};

// logouts a user
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/?loggedOut=true');
};