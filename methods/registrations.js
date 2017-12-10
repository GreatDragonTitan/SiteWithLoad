var reg_mid = {};
reg_mid.requiresLogin = function(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  }
}

reg_mid.requiresLogout = function(req, res, next) {
  if (req.session == null) {
    return next();
  } else if(req.session.userId == null){
    return next();
  } else {
      return res.redirect('/profile');
  }
}

module.exports = reg_mid;