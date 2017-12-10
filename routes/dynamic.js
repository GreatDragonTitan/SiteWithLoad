const cp = require('child_process');
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var reg_mid = require('../methods/registrations');
var Process = require('../models/process');
var myEmitter = require('../methods/emiters');

// GET route for profile
router.get('/profile', reg_mid.requiresLogin, function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          //return res.send('<h1>Name: </h1>' + user.username + '<br><a type="button" href="/logout">Logout</a>')
            res.render('profile',{username : user.username});
        }
      }
    });
});


//GET route for calculate
router.get('/calculate', reg_mid.requiresLogin, function (req, res) {
   res.render('calculate');
});

//POST route for calculate
router.post('/calculate', function (req, res, next) {
    var p= mongoose.Types.ObjectId();
    var processData = {time: req.body.time,
                      date: new Date(),
                      status: 'started',
                      progress: 0,
                      userId: req.session.userId
    }
    Process.create(processData, function (error, process) {
      if (error) {
        console.log(error);
      } else {
          p = process;
      }
    });
    
    const n = cp.fork(`calculate.js`,[req.body.time,req.session.userId,p]);
    
    n.on('message', function(m) {
       prvalue = m.pv;
       
       console.log(m.pv);
       var status = 'in process';
       if(m.pv>=100){
            status = 'finished';
        }
        Process.update(
            { "_id": p},
            { "$set": { "progress": m.pv, "status":status } },
            { "multi": true },
            function(err,numAffected) {
                if (err) throw err;
                console.log(numAffected);
                var psr = new Array();

                Process.find({'userId':req.session.userId}, function (err, docs) {
                    ps=docs;
                    myEmitter.emit('changed',docs,req.session.userId);
                });
        });
       });
    
    myEmitter.on('killall', function(){
        n.kill();
    });
    
    var ps = new Array();

    Process.find({'userId':req.session.userId}, function (err, docs) {
                    ps=docs;
                    res.render('processes',{processes: docs,oid: req.session.userId});
                });
});
    
//GET route for calculate
router.get('/processes', reg_mid.requiresLogin, function (req, res) {
    var ps = new Array();
    
    Process.find({'userId':req.session.userId}, function (err, docs) {
        ps=docs;
        res.render('processes',{processes: docs ,oid: req.session.userId});
});
});

//GET route for calculate
router.get('/killall', reg_mid.requiresLogin, function (req, res) {
     Process.update(
        { "userId": req.session.userId, "status": 'in process' },
        { "$set": { "status": 'terminated' } },
        { "multi": true },
        function(err,numAffected) {
            if (err) throw err;
            console.log(numAffected);
            myEmitter.emit('killall');
    });
    res.redirect('/processes');
});

//GET route for calculate
router.get('/adminpanel', reg_mid.requiresLogin, function (req, res) {
    var ps = new Array();
    ps[0] = {progress:23};
    
    Process.find({}, function (err, docs) {
  // docs is an array
        ps=docs;
        res.render('processes',{processes: docs});
});
    //res.render('processes',{processes: ps});
});

module.exports = router;