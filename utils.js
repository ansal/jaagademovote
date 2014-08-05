// function to check whether a user is logged in or not
exports.restrictUser = function(req, res, next) {
  if(req.isAuthenticated()) {
    next();
  } else {
    if (req.xhr) {
      res.send(403);
    } else {
      res.redirect('/?loggedOut=true');
    }
  }
};