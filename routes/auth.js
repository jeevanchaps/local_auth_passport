const express = require('express');
const router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
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

var userDetails = mongoose.model('usersInfo', users);


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
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




router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/loginFailure', function(req, res, next) {
  res.send('Failure to authenticate');
});

router.get('/loginSuccess', function(req, res, next) {
  res.render('hello');
});

router.post('/login',
passport.authenticate('local', {
  successRedirect: '/loginSuccess',
  failureRedirect: '/auth'
}));




module.exports = router;
