var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


router.get('/auth/login',function(req,res,next){
  res.render('login');
});


router.get('/auth/register',function(req,res,next){
  res.render('register');
});
