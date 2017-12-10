var express = require('express');
var router = express.Router();
var User = require('../models/user');
var reg_mid = require('../methods/registrations');



// GET route for registry
router.get('/signup', reg_mid.requiresLogout, function (req, res, next) {
  //return res.sendFile('/public/login.html'));
    res.sendFile('public/signup.html', {root: './' })
});

//POST route for registry
router.post('/signup', reg_mid.requiresLogout, function (req, res, next) {
  if (req.body.username && req.body.password) {
      var userData = {username: req.body.username,
      password: req.body.password
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/login');
      }
    });
  }
});

// GET route for login
router.get('/login', reg_mid.requiresLogout, function (req, res, next) {
  //return res.sendFile('/public/login.html'));
    res.sendFile('public/login.html', {root: './' })
});

//POST route for login
router.post('/login', reg_mid.requiresLogout, function (req, res, next) {
  if (req.body.username && req.body.password) {

    var userData = {username: req.body.username,
      password: req.body.password
    }
      
    User.authenticate(req.body.username, req.body.password,function(err, user){
        if(err){
            return next(err);
        } else if (!user) {
        var err = new Error('Wrong password.');
        err.status = 401;
        return next(err);
        } else {
            req.session.userId = user._id;
            return res.redirect('/profile');
        }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

module.exports = router;