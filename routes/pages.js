// A sample express route module

exports.index = function(req, res){
  
  if(!req.user) {
    res.render('index');
    return;
  }

  // user is logged in
  res.render('user', {user: req.user});

};

// logouts a user
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/?loggedOut=true');
};