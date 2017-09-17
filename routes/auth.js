const express = require('express');
const router = express.Router();
var passport = require('passport');
var session = require("express-session");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


router.use(passport.initialize());
router.use(passport.session());

mongoose.connect('mongodb://localhost/auth_db', {
  useMongoClient: true
});

var users = new Schema({
  username: String,
  password: String
}, {
  collection: 'usersInfo'
});

users.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// users.methods.validPassword = function(password) {
//   return bcrypt.compareSync(password, this.local.password);
// };

var userDetails = mongoose.model('usersInfo', users);


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


//register check
passport.use('local-signup',new LocalStrategy( // always name your strategy
  function(username, password, done) {
    userDetails.findOne({
        username: username
      },
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false);
        } else {
          var newUser = new userDetails();  
          newUser.username = username;
          newUser.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
  }
));

//login check
passport.use('local',new LocalStrategy(
  function(username, password, done) {
    userDetails.findOne({
        username: username
      },
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (user.password != password) {
          return done(null, false);
        }
        return done(null, user);
      });
  }
));

/*
|--------------------------------------|
| Register routes                         |
|                                      |
|--------------------------------------|
*/
router.post('/register',
  passport.authenticate('local-signup', { // use the passport name here to use the specic one
    successRedirect: '/auth/registerSuccess',
    failureRedirect: '/auth/registerFailure'
  }));


router.get('/registerFailure', function(req, res, next) {
  res.render('register');
});

router.get('/registerSuccess', function(req, res, next) {
  res.send('Registered Successfully');
});




/*
|--------------------------------------|
| Login routes                         |
|                                      |
|--------------------------------------|
*/
router.post('/login',
  passport.authenticate('local', { // use the passport name here to use the specic one
    successRedirect: '/auth/loginSuccess',
    failureRedirect: '/auth/loginFailure'
  }));

router.get('/loginFailure', function(req, res, next) {
  res.render('login');
});

router.get('/loginSuccess', function(req, res, next) {
  res.send('Logged in Successfully');
});


module.exports = router;
